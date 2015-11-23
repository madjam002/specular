import ReactInjection from 'react/lib/ReactInjection'
import ReconcileTransaction from './reconcile-transaction'

export default function () {
  ReactInjection.Updates.injectReconcileTransaction(
    ReconcileTransaction,
  )
}
