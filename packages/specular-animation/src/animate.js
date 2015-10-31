import React from 'react'
import ui from 'popmotion'
import {BeatEngine} from './beat-engine'

export class Animate extends React.Component {

  static defaultProps = {
    duration: 500,
    ease: 'linear',
  }

  constructor(props) {
    super(props)

    this.actor = new ui.Actor({
      onUpdate: this.actorUpdated,
      values: props.from || {},
    })
    this.tween = this.createTween(props)

    if (props.beat != null) {
      BeatEngine.beatBasedAnimations.push(this.actor)
    }

    this.state = { values: {} }
  }

  componentDidMount() {
    this.actor.start(this.tween)
  }

  componentWillUnmount() {
    this.actor.stop()
    delete this.actor
    delete this.tween
  }

  componentWillReceiveProps(props) {
    this.actor.stop()

    this.actor.set({ values: props.from || {} })
    this.tween = this.createTween(props)

    this.actor.start(this.tween)
  }

  createTween(props) {
    const newProps = { ...props }

    if (this.actor._beatDuration) {
      newProps.duration = this.actor._beatDuration
    }

    if (props.ease === false) {
      newProps.ease = (prog) => this.actor.activeActions[0].playDirection === 1 ? 1 : 0
    }

    return new ui.Tween(newProps)
  }

  actorUpdated = (values) => {
    this.setState({ values })
  }

  render() {
    return this.props.children(this.state.values)
  }

}
