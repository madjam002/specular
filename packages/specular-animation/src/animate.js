import React from 'react'
import {BeatEngine} from './beat-engine'
import {registerComponent, unregisterComponent} from './loop'
import {updateTween, start} from './animation-helpers'

export class Animate extends React.Component {

  static defaultProps = {
    duration: 500,
    easing: 'linear',
    yoyo: true
  }

  constructor (props) {
    super(props)

    this.tweens = []
    this.state = { values: {} }
  }

  componentDidMount () {
    registerComponent(this)

    Object.keys(this.props.values).forEach(key => this.createTween(this.props, key))
  }

  componentWillUnmount () {
    unregisterComponent(this)
  }

  componentWillReceiveProps (props) {
    // TODO
  }

  update (now) {
    this.tweens.forEach(tween => updateTween(now, tween))

    const values = {}
    this.tweens.forEach(tween => values[tween.key] = tween._currentValue)

    this.setState({ values })
  }

  createTween (props, key) {
    const inheritedProps = {
      yoyo: props.yoyo,
      easing: props.easing,
      duration: props.duration,
      beat: props.beat
    }

    const fromValues = props.from || {}

    const tween = typeof props.values[key] === 'number'
    ? { ...inheritedProps, to: props.values[key], from: fromValues[key] || 0 }
    : { ...inheritedProps, ...props.values[key], from: fromValues[key] || 0 }

    tween.key = key

    if (tween.beat != null) {
      BeatEngine.beatBasedTweens.push(tween)
    }

    this.tweens.push(tween)
    start(tween)

    return tween
  }

  render () {
    return this.props.children(this.state.values)
  }

}
