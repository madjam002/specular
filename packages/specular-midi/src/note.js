import React, {PropTypes} from 'react'
import {events} from './events'

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

  construct(element) {
    this._currentElement = element

    this._port = null
    this._channel = null
    this._note = null
    this._velocity = null

    this._onNoteOn = null
    this._onNoteOff = null
  }

  mountComponent(rootID, transaction, context) {
    const props = this._currentElement.props
    this.update({}, props)
  }

  unmountComponent() {
    this.removeEventListeners()
  }

  receiveComponent(nextElement, transaction, context) {
    const oldProps = this._currentElement.props
    this.update(oldProps, nextElement.props)
    this._currentElement = nextElement
  }

  update(oldProps, props) {
    if (
      oldProps.port !== props.port ||
      oldProps.channel !== props.channel ||
      oldProps.note !== props.note ||
      oldProps.onNoteOn !== props.onNoteOn ||
      oldProps.onNoteOff !== props.onNoteOff
    ) {
      this.removeEventListeners()

      if (props.onNoteOn) events.on(`${props.port}:${props.channel}:${props.note}:in:noteOn`, this.onNoteOn)
      if (props.onNoteOff) events.on(`${props.port}:${props.channel}:${props.note}:in:noteOff`, this.onNoteOff)
    }

    this._onNoteOn = props.onNoteOn
    this._onNoteOff = props.onNoteOff
    this._port = props.port
    this._channel = props.channel
    this._note = props.note
    this._velocity = props.velocity
  }

  removeEventListeners() {
    if (this.onNoteOn) events.removeListener(`${this._port}:${this._channel}:${this._note}:in:noteOn`, this.onNoteOn)
    if (this.onNoteOff) events.removeListener(`${this._port}:${this._channel}:${this._note}:in:noteOff`, this.onNoteOff)
  }

  onNoteOn = () => {
    this._onNoteOn()
  }

  onNoteOff = () => {
    this._onNoteOff()
  }

  isOn() {
    return true // for now...
  }

}
