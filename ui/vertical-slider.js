import React from 'react'
import Radium from 'radium'

class VerticalSlider extends React.Component {
  render() {
    return (
      <input type="range" style={styles.slider} min="0" max="255" onChange={this.props.onChange} value={this.props.value} />
    )
  }
}

VerticalSlider = Radium.Enhancer(VerticalSlider)

export {VerticalSlider}

const styles = {
  slider: {
    WebkitAppearance: 'slider-vertical',
    width: 8,
    height: 175,
    padding: '0 5px',
  }
}
