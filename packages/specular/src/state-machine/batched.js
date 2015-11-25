export class BatchedStateMachine {

  constructor(config, configProps) {
    this._config = config
    this._configProps = configProps

    if (!config.initialState) {
      throw new Error('No initial state provided')
    }

    this._state = config.initialState
    this._nextState = config.initialState
  }

  setState(nextState) {
    this._nextState = nextState
  }

  flushUpdates() {
    this._config.receiveState(this._nextState, this._state, this._configProps)

    this._state = this._nextState
    this._nextState = this._config.initialState
  }

}
