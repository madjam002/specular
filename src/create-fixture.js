import React from 'react'

export function createFixture(Definition, universe, startChannel) {

  return class FixtureWrapper extends React.Component {
    render() {
      return (
        <Definition universe={universe} start={startChannel} {... this.props} />
      )
    }
  }

}
