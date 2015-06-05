import React from 'react'
import Radium from 'radium'

import {View} from './view'

class Well extends React.Component {
  render() {
    return (
      <View style={[styles.well, this.props.style]}>{this.props.children}</View>
    )
  }
}

Well = Radium.Enhancer(Well)

const styles = {
  well: {
    backgroundColor: 'black',
    borderRadius: 5,
    padding: 10,
    margin: '0 10px 10px 0',
  }
}

export {Well}
