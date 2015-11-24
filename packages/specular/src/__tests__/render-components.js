/* eslint-env mocha */

import chai, {expect} from 'chai'
import sinon from 'sinon'

import {renderComponents} from '../render-components'

chai.use(require('sinon-chai'))

describe('render components', function () {

  describe('passing in a render pass which has the correct callbacks', function () {

    beforeEach(function () {
      this.beforeCb = sinon.spy()
      this.renderCb = sinon.spy()
      this.afterCb = sinon.spy()

      this.passes = [
        {
          before: this.beforeCb,
          render: this.renderCb,
          after: this.afterCb,
        },
      ]

      this.component = {
        _reactInternalInstance: {
          _renderedComponent: 'foo',
        },
      }

      renderComponents(this.component, this.passes)
    })

    it('should call the before callback', function () {
      expect(this.beforeCb).to.have.been.calledOnce
    })

    it('should call the render callback', function () {
      expect(this.renderCb).to.have.been.calledWith('foo')
    })

    it('should call the after callback', function () {
      expect(this.beforeCb).to.have.been.calledOnce
    })

  })

  describe('passing in a render pass which has missing callbacks', function () {

    beforeEach(function () {
      this.beforeCb = sinon.spy()
      this.renderCb = sinon.spy()
      this.afterCb = sinon.spy()

      this.component = {
        _reactInternalInstance: {
          _renderedComponent: 'foo',
        },
      }
    })

    it('should work when before isn\'t passed in', function () {
      this.passes = [
        {
          render: this.renderCb,
          after: this.afterCb,
        },
      ]

      renderComponents(this.component, this.passes)

      expect(this.renderCb).to.have.been.calledOnce
      expect(this.afterCb).to.have.been.calledOnce
    })

    it('should work when render isn\'t passed in', function () {
      this.passes = [
        {
          before: this.beforeCb,
          after: this.afterCb,
        },
      ]

      renderComponents(this.component, this.passes)

      expect(this.beforeCb).to.have.been.calledOnce
      expect(this.afterCb).to.have.been.calledOnce
    })

    it('should work when after isn\'t passed in', function () {
      this.passes = [
        {
          before: this.beforeCb,
          render: this.renderCb,
        },
      ]

      renderComponents(this.component, this.passes)

      expect(this.beforeCb).to.have.been.calledOnce
      expect(this.renderCb).to.have.been.calledOnce
    })

  })

})
