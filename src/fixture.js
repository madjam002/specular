import React, {PropTypes} from 'react'

export class Fixture extends React.Component {

  static contextTypes = {
    app: PropTypes.object
  }

  construct(element) {
    this._currentElement = element
    this.layerID = null
    this.removeLayer = null
  }

  mountComponent(rootID, transaction, context) {
    const props = this._currentElement.props
    return this.updateLayer(context, {}, props)
  }

  unmountComponent() {
    if (this.layerID)
      this.removeLayer()
  }

  receiveComponent(nextElement, transaction, context) {
    const oldProps = this._currentElement.props
    this.updateLayer(context, oldProps, nextElement.props)
    this._currentElement = nextElement
  }

  updateLayer(context, oldProps, props) {
    // delete layer if universe changed
    if (this.layerID && props.universe !== oldProps.universe) {
      this.removeLayer()
    }

    // add layer if doesn't exist
    if (!this.layerID) {
      this.layerID = context.app.addUniverseLayer(props.universe)
      this.removeLayer = () => {
        context.app.removeUniverseLayer(props.universe, this.layerID)
        delete this.layerID
      }
    }

    const channels = props.channels
    const layerData = {}

    for (let index in channels) {
      if (channels[index] === undefined) continue

      const channelNumber = parseInt(index) + props.start
      layerData[channelNumber] = channels[index]
    }

    context.app.updateUniverseLayer(props.universe, this.layerID, layerData)

    return this.layerID
  }

}
