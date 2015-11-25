import React from 'react'
import {Scene} from 'specular'
import remove from 'lodash.remove'
import {BeatEngine} from './beat-engine'
import {registerComponent, unregisterComponent} from './loop'
import {updateTween, start} from './animation-helpers'

export class Animate extends React.Component {

  static defaultProps = {
    duration: 500,
    easing: 'linear',
    yoyo: true,
  }

  constructor(props) {
    super(props)

    this.tweens = {}
    this.state = { values: {} }
  }

  componentWillMount() {
    registerComponent(this)

    // create inital tweens
    Object.keys(this.props.values).forEach(key => this.createTween(this.props, key))
  }

  componentWillUnmount() {
    unregisterComponent(this)

    Object.keys(this.tweens).forEach(tween => remove(BeatEngine.beatBasedTweens, this.tweens[tween]))
  }

  componentWillReceiveProps(nextProps) {
    const inheritedProps = {
      yoyo: nextProps.yoyo,
      easing: nextProps.easing,
      duration: nextProps.duration,
      delay: nextProps.delay,
      beat: nextProps.beat,
    }

    Object.keys(nextProps.values).forEach(key => {
      if (this.tweens[key]) {
        Object.assign(this.tweens[key], inheritedProps, nextProps.values[key])
      } else {
        this.createTween(nextProps, key)
      }
    })
  }

  update(now) {
    const tweenKeys = Object.keys(this.tweens)

    tweenKeys.forEach(tween => updateTween(now, this.tweens[tween]))

    const values = {}
    tweenKeys.forEach(tween => values[tween] = this.tweens[tween]._currentValue)

    this.setState({ values })
  }

  createTween(props, key) {
    const inheritedProps = {
      yoyo: props.yoyo,
      easing: props.easing,
      duration: props.duration,
      delay: props.delay,
      beat: props.beat,
    }

    const fromValues = props.from || {}

    const tween = typeof props.values[key] === 'number'
    ? { ...inheritedProps, to: props.values[key], from: fromValues[key] || 0 }
    : { ...inheritedProps, ...props.values[key], from: fromValues[key] || 0 }

    if (tween.beat != null) {
      BeatEngine.beatBasedTweens.push(tween)
    }

    this.tweens[key] = tween
    start(tween)

    return tween
  }

  render() {
    return <Scene>{this.props.children(this.state.values)}</Scene>
  }

}
