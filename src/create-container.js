import React, {PropTypes} from 'react'
import {Scene} from './scene'

export default function createContainer(app) {

  return class Container extends React.Component {

    static childContextTypes = {
      app: PropTypes.object,
    }

    constructor(props) {
      super(props)

      this.state = {}
    }

    getChildContext() {
      return { app }
    }

    componentWillMount() {
      app.on('props:update', this.updateProps.bind(this))
    }

    updateProps(props) {
      // HACK don't use setState as we constantly render anyway so we don't want unnecessary renders from setState!
      Object.assign(this.state, props)
    }

    getProps() {
      return this.refs.main.props
    }

    render() {
      return (
        <Scene>
          {app.mainComponent && <app.mainComponent ref="main" {... this.state} />}
        </Scene>
      )
    }

  }

}
