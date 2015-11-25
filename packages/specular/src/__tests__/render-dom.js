/* eslint-env mocha */

import chai, {expect} from 'chai'
import sinon from 'sinon'
import React from 'react'
import ReactDOM from 'react-dom'
import {jsdom} from 'jsdom'

import {render, unmountAt} from '../render'
import {createMount} from '../create-mount'
import {Scene} from '../scene'

chai.use(require('sinon-chai'))

describe('render (alongside react-dom)', function () {

  before(function () {
    this.__oldWindow = global.window
    this.__oldDocument = global.document
  })

  after(function () {
    global.window = this.__oldWindow
    global.document = this.__oldDocument
  })

  beforeEach(function () {
    global.window = jsdom('<html><body><div id="example"></div></body></html>').defaultView
    global.document = window.document

    this.componentWillMount = sinon.spy()
    this.componentWillUnmount = sinon.spy()
    this.componentWillReceiveProps = sinon.spy()

    const DOMComponentWillMount = this.DOMComponentWillMount = sinon.spy()
    const DOMComponentWillUnmount = this.DOMComponentWillUnmount = sinon.spy()

    const renderCb = this.renderCb = sinon.spy()

    const Component = this.Component = React.createClass({
      componentWillMount: this.componentWillMount,
      componentWillUnmount: this.componentWillUnmount,
      componentWillReceiveProps: this.componentWillReceiveProps,
      render() {
        renderCb(this.props)

        return <Scene />
      },
    })

    this.DOMComponent = React.createClass({
      componentWillMount() {
        this.mount = createMount()
        DOMComponentWillMount()
      },
      componentDidMount() {
        render(<Component {...this.props} />, [], this.mount)
      },
      componentWillReceiveProps(nextProps) {
        render(<Component {...nextProps} />, [], this.mount)
      },
      componentWillUnmount() {
        unmountAt(this.mount)
        DOMComponentWillUnmount()
      },
      render() {
        return <div></div>
      },
    })
  })

  describe('when mounting and unmounting a react component', function () {

    it('should mount and unmount', function () {
      const { DOMComponent } = this

      const el = document.getElementById('example')

      ReactDOM.render(<DOMComponent />, el)
      ReactDOM.unmountComponentAtNode(el)

      expect(this.componentWillMount).to.have.been.calledOnce
      expect(this.componentWillUnmount).to.have.been.calledOnce
      expect(this.componentWillReceiveProps).to.have.not.been.called
      expect(this.renderCb).to.have.been.calledWith({})

      expect(this.DOMComponentWillMount).to.have.been.calledOnce
      expect(this.DOMComponentWillUnmount).to.have.been.calledOnce
    })

    it('should pass down new props', function () {
      const { DOMComponent } = this

      const el = document.getElementById('example')

      ReactDOM.render(<DOMComponent />, el)
      ReactDOM.render(<DOMComponent foo="bar" />, el)

      expect(this.componentWillMount).to.have.been.calledOnce
      expect(this.componentWillUnmount).to.have.not.been.called

      expect(this.componentWillReceiveProps).to.have.been.calledOnce
      expect(this.renderCb).to.have.been.calledWith({})
      expect(this.renderCb).to.have.been.calledWith({ foo: 'bar' })

      expect(this.DOMComponentWillMount).to.have.been.calledOnce
      expect(this.DOMComponentWillUnmount).to.have.not.been.called

      ReactDOM.unmountComponentAtNode(el)
    })

  })

})
