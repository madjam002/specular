import React from 'react'
import Radium from 'radium'
import Colour from 'color'
import keycode from 'keycode'
import _ from 'lodash'
import {EventEmitter} from 'events'

let events = new EventEmitter()

class Button extends React.Component {
  static registerEvents() {
    document.addEventListener('keydown', (e) => {
      e.preventDefault()
      if (!e.repeat) {
        events.emit(`down:${keycode(e)}`)
        console.log('down', keycode(e))
      }
    }, false)
    document.addEventListener('keyup', (e) => {
      events.emit(`up:${keycode(e)}`)
    }, false)
  }

  componentWillMount() {
    this.keyDown = this.keyDown.bind(this)
    this.keyUp = this.keyUp.bind(this)

    if (this.props.shortcut) {
      events.on(`down:${this.props.shortcut}`, this.keyDown)
      events.on(`up:${this.props.shortcut}`, this.keyUp)
    }
  }

  componentWillUnmount() {
    events.removeListener(`down:${this.props.shortcut}`, this.keyDown)
    events.removeListener(`up:${this.props.shortcut}`, this.keyUp)
  }

  componentWillUpdate(props) {
    return props.pressed !== this.props.pressed
  }

  keyDown(e) {
    this.props.press()
  }

  keyUp(e) {
    if (this.props.release) this.props.release()
  }

  render() {
    return (
      <button style={[styles.button, {
        color: Colour(this.props.bg || this.props.background).dark() ? 'whitesmoke' : 'black',
        background: this.props.bg || this.props.background,
      }, this.props.pressed && styles.pressed, this.props.style]}
        onMouseDown={this.props.press}
        onMouseUp={this.props.release}
        onTouchStart={this.props.press}
        onTouchEnd={this.props.release}
      >
        {this.props.children}
        {this.props.shortcut ? <div style={styles.shortcutOverlay}>
          {this.props.shortcut}
        </div> : null}
      </button>
    )
  }
}

class StateButton extends React.Component {
  press() {
    console.log('pressed', this.props.state)
    this.props.c.setProps(this.props.state)
    if (this.props.onPress) this.props.onPress(this.props.state)
  }

  release() {
    if (this.props.stateOff && this.isPressed()) {
      this.props.c.setProps(this.props.stateOff)
    }
  }

  isPressed() {
    let isPressed = true
    let currentState = this.props.c.state

    for (let k in this.props.state) {
      if (!_.isEqual(currentState[k], this.props.state[k])) {
        isPressed = false
        break
      }
    }

    return isPressed
  }

  render() {
    let isPressed = this.isPressed()

    return (
      <Button
        pressed={isPressed}
        press={this.press.bind(this)}
        release={this.release.bind(this)}
        {... this.props}>{this.props.children}</Button>
    )
  }
}

Button = Radium.Enhancer(Button)
StateButton = Radium.Enhancer(StateButton)

Button.defaultProps = {
  background: '#333'
}

const styles = {
  button: {
    padding: '10px 15px 10px 15px',
    fontSize: 13,
    border: '1px solid black',
    margin: '0 2px 2px 0',
    borderRadius: 5,
    outline: 'none',
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },

  shortcutOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    color: 'black',
    fontSize: 10,
    textTransform: 'uppercase',
    padding: '3px 5px 3px 5px',
    background: 'rgba(255, 255, 255, 0.5)',
  },

  pressed: {
    boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.4)',
    outline: '3px solid lime',
  },
}


export {Button, StateButton}
