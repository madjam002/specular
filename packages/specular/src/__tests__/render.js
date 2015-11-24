/* eslint-env mocha */

import chai, {expect} from 'chai'
import sinon from 'sinon'
import React from 'react'

import {render, unmountAt} from '../render'
import {createMount} from '../create-mount'
import {Scene} from '../scene'

chai.use(require('sinon-chai'))

describe('render', function () {

  describe('when mounting and unmounting a react component', function () {

    beforeEach(function () {
      this.componentWillMount = sinon.spy()
      this.componentWillUnmount = sinon.spy()
      this.componentWillReceiveProps = sinon.spy()
      this.render = sinon.spy()

      this.mount = createMount()

      this.Component = React.createClass({
        componentWillMount: this.componentWillMount,
        componentWillUnmount: this.componentWillUnmount,
        componentWillReceiveProps: this.componentWillReceiveProps,
        render() { return <Scene /> },
      })
    })

    it('should mount and unmount', function () {
      const { Component } = this

      render(<Component />, [], this.mount)
      unmountAt(this.mount)

      expect(this.componentWillMount).to.have.been.calledOnce
      expect(this.componentWillUnmount).to.have.been.calledOnce
      expect(this.componentWillReceiveProps).to.have.not.been.called
    })

    it('should not mount a new component when render called twice with same mount', function () {
      const { Component } = this

      render(<Component />, [], this.mount)
      render(<Component />, [], this.mount)

      expect(this.componentWillMount).to.have.been.calledOnce
      expect(this.componentWillUnmount).to.have.not.been.called
      expect(this.componentWillReceiveProps).to.have.been.calledOnce

      unmountAt(this.mount)
    })

  })

})
