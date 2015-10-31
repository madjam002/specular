import React from 'react'
import ui from 'popmotion'
import {BeatEngine} from './beat-engine'

export class Animate extends React.Component {

  static defaultProps = {
    duration: 500,
  }

  constructor(props) {
    super(props)

    this.actor = new ui.Actor({
      onUpdate: this.actorUpdated,
      values: props.from || {},
    })
    this.tween = new ui.Tween({ ...props })

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

    const duration = this.actor._beatDuration ? this.actor._beatDuration : props.duration
    this.tween = new ui.Tween({ ...props, duration })

    this.actor.start(this.tween)
  }

  actorUpdated = (values) => {
    this.setState({ values })
  }

  render() {
    return this.props.children(this.state.values)
  }

}
