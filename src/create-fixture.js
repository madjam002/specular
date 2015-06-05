import {Component} from './component'
import {React} from './react'

export var CreateFixture = (Definition, startChannel) => {
  return class FixtureWrapper extends Component {
    render() {
      return (
        <Definition start={startChannel} {... this.props} />
      )
    }
  }
}
