import React, {PropTypes} from 'react'
import debounce from 'lodash.debounce'
import {events} from './events'

export class Control extends React.Component {

  static propTypes = {
    port: PropTypes.number.isRequired,
    channel: PropTypes.number.isRequired,
    control: PropTypes.number.isRequired,
    onUpdate: PropTypes.func,
  }

  static defaultProps = {
    channel: 1,
  }

  construct(element) {
    this._currentElement = element
    this._stateMachine = null
    this._oldProps = {}

    this.gotControlChange = debounce(this.gotControlChange)
  }

  mountComponent(rootID, transaction, context) {
    events.on('note:control-change', this.gotControlChange)
  }

  unmountComponent() {
    events.removeListener('note:control-change', this.gotControlChange)
  }

  receiveComponent(nextElement, transaction, context) {
    this._currentElement = nextElement
  }

  gotControlChange = ({ port, channel, control, value }) => {
    const props = this._currentElement.props

    if (
      props.port === port &&
      props.channel === channel &&
      props.control === control &&
      typeof props.onUpdate === 'function'
    ) {
      props.onUpdate(value)
    }
  }

}
