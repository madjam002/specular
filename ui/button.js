import React from 'react'
import Radium from 'radium'
import Colour from 'color'
import keycode from 'keycode'

class Button extends React.Component {
  componentWillMount() {
    if (this.props.shortcut) {
      document.addEventListener('keydown', this.keyDown.bind(this), false)
      document.addEventListener('keyup', this.keyUp.bind(this), false)
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.keyDown.bind(this))
    document.removeEventListener('keyup', this.keyUp.bind(this))
  }

  keyDown(e) {
    if (keycode(e) === this.props.shortcut && !e.repeat) {
      this.props.press()
    }
  }

  keyUp(e) {
    if (keycode(e) === this.props.shortcut && this.props.release) {
      this.props.release()
    }
  }

  render() {
    return (
      <button style={[styles.button, {
        color: Colour(this.props.background).dark() ? 'whitesmoke' : 'black',
        background: this.props.background,
      }, this.props.pressed && styles.pressed, this.props.style]} onClick={this.props.press} onMouseUp={this.props.release}>
        {this.props.children}
        {this.props.shortcut ? <div style={styles.shortcutOverlay}>
          {this.props.shortcut}
        </div> : null}
      </button>
    )
  }
}

Button = Radium.Enhancer(Button)

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


export {Button}
