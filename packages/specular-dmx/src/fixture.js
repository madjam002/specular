import React from 'react'
import {LeafComponent} from 'specular'

@LeafComponent
export class Fixture extends React.Component {

  constructor(element) {
    super(element)

    this._channels = {}
    this._universe = null
  }

  onComponentMount(props) {
    this.update({}, props)
  }

  onComponentUnmount() {
    delete this._channels
    this.specularQueueUpdate()
  }

  onComponentReceiveProps(nextProps, prevProps) {
    this.update(prevProps, nextProps)
  }

  update(oldProps, props) {
    this._channels = {}
    this._universe = props.universe

    const channels = props.channels

    for (const index in channels) {
      if (channels[index] === undefined) continue

      const channelNumber = parseInt(index, 10) + props.start
      this._channels[channelNumber] = channels[index]
    }

    this.specularQueueUpdate()
  }

}
