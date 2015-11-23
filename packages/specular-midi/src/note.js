import React, {PropTypes} from 'react'
import {createBatchedStateMachineCache} from 'specular'
import {noteStateMachine} from './state-machine'
import {events} from './events'

export const _stateMachines = createBatchedStateMachineCache(noteStateMachine)

export class Note extends React.Component {

  static propTypes = {
    port: PropTypes.number.isRequired,
    channel: PropTypes.number.isRequired,
    note: PropTypes.number.isRequired,
    velocity: PropTypes.number,
    onNoteOn: PropTypes.func,
    onNoteOff: PropTypes.func,
  }

  static contextTypes = {
    specularQueueUpdate: PropTypes.func.isRequired,
  }

  static defaultProps = {
    channel: 1,
    velocity: 0,
  }

  construct(element) {
    this._currentElement = element
    this._stateMachine = null
    this._oldProps = {}
  }

  mountComponent(rootID, transaction, context) {
    events.on('note:on', this.gotNoteOn)
    events.on('note:off', this.gotNoteOff)

    context.specularQueueUpdate()
  }

  unmountComponent() {
    if (this._stateMachine) {
      this._stateMachine.setState({ on: false })
    }

    events.removeListener('note:on', this.gotNoteOn)
    events.removeListener('note:off', this.gotNoteOff)
  }

  receiveComponent(nextElement, transaction, context) {
    this._oldProps = this._currentElement.props
    this._currentElement = nextElement

    context.specularQueueUpdate()
  }

  render() {
    const props = this._currentElement.props
    const oldProps = this._oldProps
    this._oldProps = props

    if (
      oldProps.port !== props.port ||
      oldProps.channel !== props.channel ||
      oldProps.note !== props.note
    ) {
      if (this._stateMachine) {
        this._stateMachine.setState({ on: false })
      }

      const stateMachineProps = {
        port: props.port,
        channel: props.channel,
        note: props.note,
      }

      this._stateMachine = _stateMachines.get(JSON.stringify(stateMachineProps), stateMachineProps)
    }

    if (this._stateMachine) {
      this._stateMachine.setState({ on: true, velocity: props.velocity })
    }
  }

  gotNoteOn = ({ port, channel, note }) => {
    const props = this._currentElement.props

    if (
      props.port === port &&
      props.channel === channel &&
      props.note === note &&
      typeof props.onNoteOn === 'function'
    ) {
      props.onNoteOn()
    }
  }

  gotNoteOff = ({ port, channel, note }) => {
    const props = this._currentElement.props

    if (
      props.port === port &&
      props.channel === channel &&
      props.note === note &&
      typeof props.onNoteOff === 'function'
    ) {
      props.onNoteOff()
    }
  }

}
