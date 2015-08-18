import CallbackQueue from 'react/lib/CallbackQueue'
import PooledClass from 'react/lib/PooledClass'
import Transaction from 'react/lib/Transaction'

const ON_READY_QUEUEING = {
  initialize() {
    this.reactMountReady.reset()
  },

  close() {
    this.reactMountReady.notifyAll()
  },
}

@PooledClass.addPoolingTo
export default function ReconcileTransaction() {
  this.reinitializeTransaction()
  this.reactMountReady = CallbackQueue.getPooled(null)
}

const Mixin = {
  getTransactionWrappers() {
    return [ON_READY_QUEUEING]
  },

  getReactMountReady() {
    return this.reactMountReady
  },

  destructor() {
    CallbackQueue.release(this.reactMountReady)
    this.reactMountReady = null
  },
}

Object.assign(
  ReconcileTransaction.prototype,
  Transaction.Mixin,
  ReconcileTransaction,
  Mixin,
)
