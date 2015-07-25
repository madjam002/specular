import React from 'react'
import Radium from 'radium'

import {Well} from './well'
import {View} from './view'
import {Row, Col} from './grid'
import {H3} from './text'
import {Button} from './button'

class Pages extends React.Component {
  constructor(props) {
    super(props)

    this.state = {page: 0}
  }

  prev() {
    let page = this.state.page - 1
    if (page < 0) page = this.props.pages.length - 1
    this.setState({page: page})
  }

  next() {
    let page = this.state.page + 1
    if (page >= this.props.pages.length) page = 0
    this.setState({page: page})
  }

  render() {
    return (
      <Well style={this.props.style}>
        <Row align="center" justify="space-between">
          <Col>
            <Button shortcut={this.props.prevShortcut} press={this.prev.bind(this)}>Prev</Button>
          </Col>
          <Col><H3 align="center">{this.props.title} ({this.state.page + 1}/{this.props.pages.length})</H3></Col>
          <Col>
            <Button shortcut={this.props.nextShortcut} press={this.next.bind(this)}>Next</Button>
          </Col>
        </Row>

        <View key={this.state.page}>{this.props.pages[this.state.page]}</View>
      </Well>
    )
  }
}

Pages = Radium.Enhancer(Pages)

export {Pages}
