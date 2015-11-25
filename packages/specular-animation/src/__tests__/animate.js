/* eslint-env mocha */
import React from 'react'
import chai, {expect} from 'chai'
import sinon from 'sinon'
import proxyquire from 'proxyquire'
import reactAssertions, {shallowRender} from 'chai-react-assertions'

chai.use(reactAssertions)
chai.use(require('sinon-chai'))

const loopMock = {
  registerComponent: null,
  unregisterComponent: null,
}

let Animate

describe.only('<Animate /> component', function () {

  describe('initial state', function () {

    beforeEach(function () {
      loopMock.registerComponent = sinon.spy()
      loopMock.unregisterComponentSpy = sinon.spy()

      Animate = proxyquire('../animate', {
        './loop': loopMock,
      }).Animate

      this.tree = shallowRender(
        <Animate values={{val: 50}}>
          {() => {}}
        </Animate>
      )
    })

    describe('animation with duration', function () {
      it('should register the component with the loop', function () {
        expect(loopMock.registerComponent).to.have.been.calledOnce
      })

      it('should create the tween filling in default props', function () {
        const instance = this.tree.getMountedInstance()

        expect(instance.tweens.val).to.contain({
          yoyo: true,
          easing: 'linear',
          duration: 500,
          to: 50,
          from: 0,
        })
      })
    })

  })

})
