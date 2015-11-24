import debounce from 'lodash.debounce'
import ReactInstanceHandles from 'react/lib/ReactInstanceHandles'
import ReactUpdates from 'react/lib/ReactUpdates'
import ReactReconciler from 'react/lib/ReactReconciler'
import ReactElement from 'react/lib/ReactElement'
import ReactUpdateQueue from 'react/lib/ReactUpdateQueue'
import instantiateReactComponent from 'react/lib/instantiateReactComponent'
import shouldUpdateReactComponent from 'react/lib/shouldUpdateReactComponent'
import invariant from 'invariant'

import inject from './inject'
import {renderComponents} from './render-components'
import {createMount} from './create-mount'

inject()

const mountedComponents = {}

function renderNewComponent(element, renderPasses) {
  const id = ReactInstanceHandles.createReactRootID()
  const transaction = ReactUpdates.ReactReconcileTransaction.getPooled()
  const component = instantiateReactComponent(element)

  transaction.perform(() =>
    ReactReconciler.mountComponent(component, id, transaction, {
      specularQueueUpdate: debounce(() => renderComponents(component._instance, renderPasses)),
    })
  )

  renderComponents(component._instance, renderPasses)

  return component
}

function updateExistingComponent(prevComponent, prevElement, nextElement) {
  if (shouldUpdateReactComponent(prevElement, nextElement)) {
    ReactUpdateQueue.enqueueElementInternal(prevComponent, nextElement)
  }
}

export function render(nextElement, renderPasses, mount) {
  invariant(
    ReactElement.isValidElement(nextElement),
    'render(): You must pass a valid ReactElement.',
  )

  if (!mount) {
    mount = createMount()
  }

  const prevComponent = mountedComponents[JSON.stringify(mount)]

  if (prevComponent) {
    const prevElement = prevComponent._currentElement
    return updateExistingComponent(prevComponent, prevElement, nextElement)
  }

  const component = renderNewComponent(nextElement, renderPasses)
  mountedComponents[JSON.stringify(mount)] = component

  return component._instance
}

export function unmountAt(mount) {
  const component = mountedComponents[JSON.stringify(mount)]

  invariant(
    !!component,
    'unmountAt(): You must pass a valid mount which needs unmounting.',
  )

  ReactReconciler.unmountComponent(component)
}
