import React from 'react'
import Radium from 'radium'

class View extends React.Component {
  render() {
    return (
      <div style={[this.props.style]}>{this.props.children}</div>
    )
  }
}

View = Radium.Enhancer(View)

export {View}
