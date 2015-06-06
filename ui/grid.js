import React from 'react'
import Radium from 'radium'
import _ from 'lodash'

import {View} from './view'

const MARGIN = 10

class Row extends React.Component {
  render() {
    return (
      <View style={[
            styles.row,
            {
              alignItems: this.props.align,
              justifyContent: this.props.justify,
              marginRight: -MARGIN
            },
            this.props.style,
          ]}>
        {this.props.children}
      </View>
    )
  }
}

class Col extends React.Component {
  calcWidth(size) {
    if (!size) return undefined

    return `${(100 * size) / this.props.columns}%`
  }

  render() {
    let responsiveStyleQuery = {
      flexBasis: this.props.xs ? this.calcWidth(this.props.xs) : '100%',
      maxWidth: this.props.xs ? this.calcWidth(this.props.xs) : '100%',
    }

    if (this.props.sm) {
      responsiveStyleQuery[`@media (min-width: 768px)`] = {
        flexBasis: this.calcWidth(this.props.sm),
        maxWidth: this.calcWidth(this.props.sm),
      }
    }

    if (this.props.md) {
      responsiveStyleQuery[`@media (min-width: 992px)`] = {
        flexBasis: this.calcWidth(this.props.md),
        maxWidth: this.calcWidth(this.props.md),
      }
    }

    if (this.props.lg) {
      responsiveStyleQuery[`@media (min-width: 1200px)`] = {
        flexBasis: this.calcWidth(this.props.lg),
        maxWidth: this.calcWidth(this.props.lg),
      }
    }

    return (
      <View style={[
            styles.column,
            (this.props.xs || this.props.sm || this.props.md || this.props.lg) && responsiveStyleQuery,
            {
              paddingRight: this.props.margin,
            },
            this.props.style
          ]}>
        {this.props.children}
      </View>
    )
  }
}

Col.defaultProps = {
  columns: 12
}

Row = Radium.Enhancer(Row)
Col = Radium.Enhancer(Col)

export {Row, Col}

const styles = {
  row: {
    display: 'flex',
    flexDirection: 'row',
    flex: '0 1 auto',
    flexWrap: 'wrap',
  },
  column: {
    boxSizing: 'border-box',
    paddingRight: MARGIN,
  },
}
