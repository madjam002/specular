import debounce from 'lodash.debounce'
import ReactInstanceHandles from 'react/lib/ReactInstanceHandles'
import ReactUpdates from 'react/lib/ReactUpdates'
import ReactReconciler from 'react/lib/ReactReconciler'
import ReactElement from 'react/lib/ReactElement'
import instantiateReactComponent from 'react/lib/instantiateReactComponent'
import invariant from 'invariant'

import inject from './inject'
import {renderComponents} from './render-components'

inject()

export function render(element, renderPasses) {
  invariant(
    ReactElement.isValidElement(element),
    'render(): You must pass a valid ReactElement.'
  )

  const id = ReactInstanceHandles.createReactRootID()
  const transaction = ReactUpdates.ReactReconcileTransaction.getPooled()
  const component = instantiateReactComponent(element)

  transaction.perform(() =>
    ReactReconciler.mountComponent(component, id, transaction, {
      specularQueueUpdate: debounce(() => renderComponents(component._instance, renderPasses)),
    })
  )

  renderComponents(component._instance, renderPasses)

  return component._instance
}
