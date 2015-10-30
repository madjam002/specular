import React, {PropTypes} from 'react'

export class Fixture extends React.Component {

  static contextTypes = {
    specularQueueUpdate: PropTypes.func.isRequired,
  }

  construct(element) {
    this._currentElement = element
    this._channels = {}
    this._universe = null
  }

  mountComponent(rootId, transaction, context) {
    const props = this._currentElement.props
    this.update(context, {}, props)
  }

  unmountComponent() {
    delete this._channels
  }

  receiveComponent(nextElement, transaction, context) {
    const oldProps = this._currentElement.props
    this.update(context, oldProps, nextElement.props)
    this._currentElement = nextElement
  }

  update(context, oldProps, props) {
    this._channels = {}
    this._universe = props.universe

    const channels = props.channels

    for (let index in channels) {
      if (channels[index] === undefined) continue

      const channelNumber = parseInt(index) + props.start
      this._channels[channelNumber] = channels[index]
    }

    context.specularQueueUpdate()
  }

}
