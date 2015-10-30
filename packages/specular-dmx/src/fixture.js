import React, {PropTypes} from 'react'

export class Fixture extends React.Component {

  construct(element) {
    this._currentElement = element
    this._channels = {}
    this._universe = null
  }

  mountComponent(rootId, transaction) {
    const props = this._currentElement.props
    this.update({}, props)
  }

  unmountComponent() {
    delete this._channels
  }

  receiveComponent(nextElement, transaction, context) {
    const oldProps = this._currentElement.props
    this.update(oldProps, nextElement.props)
    this._currentElement = nextElement
  }

  update(oldProps, props) {
    this._channels = {}
    this._universe = props.universe

    const channels = props.channels

    for (let index in channels) {
      if (channels[index] === undefined) continue

      const channelNumber = parseInt(index) + props.start
      this._channels[channelNumber] = channels[index]
    }
  }

}
