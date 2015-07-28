import React, {PropTypes} from 'react'

export class Fixture extends React.Component {

  static contextTypes = {
    app: PropTypes.object
  }

  construct(element) {
    this._currentElement = element
    this.fixtureData = {}
    this.fixtureUniverse = null
  }

  mountComponent(rootID, transaction, context) {
    const props = this._currentElement.props
    this.update(context, {}, props)
  }

  unmountComponent() {

  }

  receiveComponent(nextElement, transaction, context) {
    const oldProps = this._currentElement.props
    this.update(context, oldProps, nextElement.props)
    this._currentElement = nextElement
  }

  update(context, oldProps, props) {
    this.fixtureData = {}
    this.fixtureUniverse = props.universe

    const channels = props.channels

    for (let index in channels) {
      if (channels[index] === undefined) continue

      const channelNumber = parseInt(index) + props.start
      this.fixtureData[channelNumber] = channels[index]
    }

    context.app.queueUpdate()
  }

}
