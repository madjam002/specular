import React from 'react'
import ui from 'popmotion'
import {BeatEngine} from './beat-engine'

export class Animate extends React.Component {

  constructor(props) {
    super(props)

    this.actor = new ui.Actor({
      onUpdate: this.actorUpdated,
    })
    this.tween = new ui.Tween(props)

    if (props.beat != null) {
      BeatEngine.beatBasedAnimations.push(this.actor)
    }

    this.state = { values: {} }
  }

  componentDidMount() {
    this.actor.start(this.tween)
  }

  actorUpdated = (values) => {
    this.setState({ values })
  }

  render() {
    return this.props.children(this.state.values)
  }

}
