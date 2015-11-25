import React, {PropTypes} from 'react'
import {LeafComponent, createBatchedStateMachineCache} from 'specular'
import {noteStateMachine} from './state-machine'
import {events} from './events'

export const _stateMachines = createBatchedStateMachineCache(noteStateMachine)

@LeafComponent
export class Note extends React.Component {

  static propTypes = {
    port: PropTypes.number.isRequired,
    channel: PropTypes.number.isRequired,
    note: PropTypes.number.isRequired,
    velocity: PropTypes.number,
    onNoteOn: PropTypes.func,
    onNoteOff: PropTypes.func,
  }

  static defaultProps = {
    channel: 1,
    velocity: 0,
  }

  constructor(element) {
    super(element)

    this._stateMachine = null
    this._oldProps = {}
  }

  onComponentMount(props) {
    events.on('note:on', this.gotNoteOn)
    events.on('note:off', this.gotNoteOff)

    this.specularQueueUpdate()
  }

  onComponentUnmount() {
    events.removeListener('note:on', this.gotNoteOn)
    events.removeListener('note:off', this.gotNoteOff)

    this.specularQueueUpdate()
  }

  onComponentReceiveProps(nextProps, prevProps) {
    this._oldProps = prevProps
    this.specularQueueUpdate()
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
