/* eslint-env mocha */

import chai, {expect} from 'chai'
import sinon from 'sinon'
import proxyquire from 'proxyquire'
import {BatchedStateMachine} from 'specular'

let sendMessageSpy

const portsMock = {
  get() {
    return {
      output: {
        sendMessage: sendMessageSpy,
      },
    }
  },
}

const { noteStateMachine } = proxyquire('../state-machine', {
  './ports': { ports: portsMock },
})

chai.use(require('sinon-chai'))

const NOTE = 5

describe('note state machine', function () {

  beforeEach(function () {
    sendMessageSpy = portsMock.get().output.sendMessage = sinon.spy()
  })

  beforeEach(function () {
    this.stateMachine = new BatchedStateMachine(noteStateMachine, {
      port: 1,
      channel: 1,
      note: 5,
    })
  })

  describe('off -> on', function () {
    it('should fire a note on message', function () {
      const velocity = 5
      this.stateMachine.setState({ on: true, velocity })
      this.stateMachine.flushUpdates()

      expect(sendMessageSpy).to.have.been.calledWith([
        144, // 144+ is note on
        NOTE,
        velocity,
      ])
    })
  })

  describe('on -> off', function () {
    it('should fire a note off message', function () {
      const velocity = 12
      this.stateMachine.setState({ on: true })
      this.stateMachine.flushUpdates()

      this.stateMachine.setState({ on: false, velocity })
      this.stateMachine.flushUpdates()

      expect(sendMessageSpy).to.have.been.calledWith([
        128, // 128+ is note off
        NOTE,
        velocity,
      ])
    })
  })

  describe('on -> on', function () {
    it('should fire a note on message if the velocity has changed', function () {
      const velocity = 9
      this.stateMachine.setState({ on: true, velocity: 3 })
      this.stateMachine.flushUpdates()

      this.stateMachine.setState({ on: true, velocity })
      this.stateMachine.flushUpdates()

      expect(sendMessageSpy).to.have.been.calledTwice
      expect(sendMessageSpy).to.have.been.calledWith([
        144, // 144+ is note off
        NOTE,
        3,
      ])
      expect(sendMessageSpy).to.have.been.calledWith([
        144, // 144+ is note off
        NOTE,
        velocity,
      ])
    })

    it('shouldn\'t fire a note on message if the velocity hasn\'t changed', function () {
      const velocity = 9
      this.stateMachine.setState({ on: true, velocity })
      this.stateMachine.flushUpdates()

      this.stateMachine.setState({ on: true, velocity })
      this.stateMachine.flushUpdates()

      expect(sendMessageSpy).to.have.been.calledOnce
      expect(sendMessageSpy).to.have.been.calledWith([
        144, // 144+ is note off
        NOTE,
        velocity,
      ])
    })
  })

})
