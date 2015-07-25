import React from 'react'
import Radium from 'radium'
import Colour from 'color'

class ColourPicker extends React.Component {
  change(e) {
    this.props.pick(e.target.value)
  }

  render() {
    return (
      <input type="color" style={[styles.picker, this.props.style]} value={Colour(this.props.value).hexString()} onChange={this.change.bind(this)}/>
    )
  }
}

ColourPicker = Radium.Enhancer(ColourPicker)


const styles = {
  picker: {
    border: '1px solid black',
    margin: '0 2px 2px 0',
    borderRadius: 5,
    outline: 'none',
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    alignSelf: 'center',
    height: 30,
  },
}


export {ColourPicker}
