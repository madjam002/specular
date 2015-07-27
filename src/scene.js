import React from 'react'
import ReactMultiChild from 'react/lib/ReactMultiChild'

export class Scene extends React.Component {

  construct(element) {
    this._currentElement = element
    this._renderedChildren = {}
  }

  mountComponent(rootID, transaction, context) {
    this.mountChildren(this._currentElement.props, transaction, context)
  }

  unmountComponent() {
    this.unmountChildren()
  }

  receiveComponent(nextElement, transaction, context) {
    const props = nextElement.props
    this._updateChildren(props.children, transaction, context)
    this._currentElement = nextElement
  }

}

Object.assign(
  Scene.prototype,
  ReactMultiChild.Mixin,
)
