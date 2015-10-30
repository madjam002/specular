import _ from 'lodash'
import React, {PropTypes} from 'react'
import ReactInstanceHandles from 'react/lib/ReactInstanceHandles'
import ReactUpdates from 'react/lib/ReactUpdates'
import ReactElement from 'react/lib/ReactElement'
import instantiateReactComponent from 'react/lib/instantiateReactComponent'
import invariant from 'invariant'
import inject from './inject'

import {renderComponents} from './render-components'

inject()

export function render(element, renderPasses) {
  invariant(
    ReactElement.isValidElement(element),
    'render(): You must pass a valid ReactElement.',
  )

  const wrapperComponent = React.createClass({
    childContextTypes: {
      specularQueueUpdate: PropTypes.func,
    },
    componentWillMount() {
      this.specularQueueUpdate = _.debounce(() => renderComponents(this, renderPasses))
    },
    getChildContext() {
      return {
        specularQueueUpdate: this.specularQueueUpdate,
      }
    },
    render() {
      return element
    },
  })

  const id = ReactInstanceHandles.createReactRootID()
  const transaction = ReactUpdates.ReactReconcileTransaction.getPooled()
  const component = instantiateReactComponent(React.createElement(wrapperComponent))

  transaction.perform(() =>
    component.mountComponent(id, transaction, {})
  )

  renderComponents(component._instance, renderPasses)

  return component._instance
}
