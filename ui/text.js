import React from 'react'
import Radium from 'radium'

class Text extends React.Component {
  render() {
    return (
      <div style={[{textAlign: this.props.align}, this.props.style]}>{this.props.children}</div>
    )
  }
}

class H3 extends React.Component {
  render() {
    return (
      <Text style={[styles.h3, this.props.style]} {... this.props}>{this.props.children}</Text>
    )
  }
}

class H2 extends React.Component {
  render() {
    return (
      <Text style={[styles.h2, this.props.style]} {... this.props}>{this.props.children}</Text>
    )
  }
}

Text = Radium.Enhancer(Text)
H2 = Radium.Enhancer(H2)
H3 = Radium.Enhancer(H3)

const styles = {
  h2: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  h3: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  }
}

export {Text, H2, H3}
