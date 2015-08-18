import React, {PropTypes} from 'react'
import {Scene} from './scene'
import {setBeatInterval} from './animation/set-beat-interval'

export class Sequencer extends React.Component {

  static propTypes = {
    count: PropTypes.number.isRequired,
    beats: PropTypes.number,
    children: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      curr: 0,
    }
  }

  componentWillMount() {
    this.clearInterval = setBeatInterval(() => {
      let next = this.state.curr + 1
      if (next >= this.props.count) next = 0

      this.setState({ curr: next })
    }, this.props.beats)
  }

  componentWillUnmount() {
    if (this.clearInterval)
      this.clearInterval()
  }

  componentWillReceiveProps(newProps) {
    if (newProps.beats !== this.props.beats) {
      if (this.clearInterval)
        this.clearInterval()

      this.clearInterval = setBeatInterval(() => {
        let next = this.state.curr + 1
        if (next >= this.props.count) next = 0

        this.setState({ curr: next })
      }, newProps.beats)
    }
  }

  render() {
    // children should be a single function with an argument of the current sequencer index
    const func = this.props.children

    return (
      <Scene>{func(this.state.curr)}</Scene>
    )
  }

}
