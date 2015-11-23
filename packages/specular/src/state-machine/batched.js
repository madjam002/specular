export class BatchedStateMachine {

  constructor(config, configProps) {
    this._config = config
    this._configProps = configProps

    if (!config.initialState) {
      throw new Error('No initial state provided')
    }

    this._state = null
    this.props = {}

    this._nextStateMethod = null
    this._nextState = config.initialState
    this._nextProps = null

    Object.keys(config).forEach(stateKey => {
      Object.keys(config[stateKey]).forEach(stateMethodKey => {
        const stateMethod = config[stateKey][stateMethodKey]

        this[stateMethodKey] = (props) => {
          if (this._state !== stateKey && this._nextState !== stateKey) {
            throw new Error('Method \'' + stateMethodKey + '\' does not exist on current state')
          }

          this._nextStateMethod = stateMethod
          this._nextState = stateMethod.to
          this._nextProps = props
        }
      })
    })
  }

  flushUpdates() {
    if (!this._state) {
      // call initial function for initial state
      this._config[this._nextState].fn(this._nextProps, this._configProps)
      this._state = this._nextState
    } else {
      // call current state -> next state method
      this._nextStateMethod.fn(this._nextProps, this._configProps)
      this._state = this._nextStateMethod.to
    }

    this.props = this._nextProps

    this._nextStateMethod = null
    this._nextState = null
    this._nextProps = null
  }

}
