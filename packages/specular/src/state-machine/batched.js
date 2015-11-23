export class BatchedStateMachine {

  constructor(config, configProps) {
    this._config = config
    this._configProps = configProps

    if (!config.initialState) {
      throw new Error('No initial state provided')
    }

    this._dirty = false
    this._state = config.initialState
  }

  setState(nextState) {
    this._nextState = nextState
    this._dirty = true
  }

  flushUpdates() {
    if (!this._dirty) {
      return
    }

    this._config.receiveState(this._nextState, this._state, this._configProps)

    this._state = this._nextState
    this._nextState = null
    this._dirty = false
  }

}
