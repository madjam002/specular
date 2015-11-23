import {PropTypes} from 'react'

export function LeafComponent(Component) {

  if (typeof Component.prototype.construct === 'function') {
    throw new Error('Cannot use LeafComponent decorator when low level React methods are already implemented.')
  }

  if (Component.contextTypes) {
    Component.contextTypes.specularQueueUpdate = PropTypes.func.isRequired
  } else {
    Component.contextTypes = {
      specularQueueUpdate: PropTypes.func.isRequired,
    }
  }

  Component.prototype.construct = function (element) {
    this._currentElement = element
    this.specularQueueUpdate = () => {}
  }

  Component.prototype.mountComponent = function (rootId, transaction, context) {
    this.specularQueueUpdate = context.specularQueueUpdate

    if (typeof this.onComponentMount === 'function') {
      this.onComponentMount(this._currentElement.props, context)
    }
  }

  Component.prototype.unmountComponent = function () {
    if (typeof this.onComponentUnmount === 'function') {
      this.onComponentUnmount(this._currentElement.props)
    }
  }

  Component.prototype.receiveComponent = function (nextElement, transaction, context) {
    if (typeof this.onComponentReceiveProps === 'function') {
      this.onComponentReceiveProps(nextElement.props, this._currentElement.props, context)
    }

    this._currentElement = nextElement
  }

  return Component

}
