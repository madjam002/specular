/* eslint-env mocha */

import chai, {expect} from 'chai'
import sinon from 'sinon'
import {BatchedStateMachine} from '../batched'
import {createStateMachineConfig} from '../create-config'

chai.use(require('sinon-chai'))

describe('BatchedStateMachine', function () {

  beforeEach(function () {
    this.offToOn = sinon.spy()
    this.onToOff = sinon.spy()
    this.onToOn = sinon.spy()

    this.create = initialState => {
      this.config = createStateMachineConfig({
        initialState,

        receiveState: (nextState, oldState, { port, channel, note }) => {
          if (nextState.on && !oldState.on) {
            // off -> on
            this.offToOn()
          } else if (!nextState.on && oldState.on) {
            // on -> off
            this.onToOff()
          } else if (nextState.on && oldState.on) {
            // on -> on
            this.onToOn()
          }
        },
      })

      this.stateMachine = new BatchedStateMachine(this.config, {})
    }
  })

  describe('initial state', function () {

    it('should throw an error if not provided', function () {
      expect(() => {
        this.create(null)
      }).to.throw('No initial state provided')
    })

    it('shouldn\'t call receive props if updates haven\'t been flushed', function () {
      this.create({ on: false })
      this.stateMachine.setState({ on: true })

      expect(this.offToOn).to.not.have.been.called
    })

    it('should call receive props with the first setState', function () {
      this.create({ on: false })
      this.stateMachine.setState({ on: true })
      this.stateMachine.flushUpdates()

      expect(this.offToOn).to.have.been.called
    })

    it('should call receive props once after many setState\'s', function () {
      this.create({ on: false })
      this.stateMachine.setState({ on: true })
      this.stateMachine.setState({ on: true })
      this.stateMachine.flushUpdates()

      expect(this.offToOn).to.have.been.calledOnce
    })

  })

  describe('flushing updates', function () {

    it('should only call receive props with state between flushing updates', function () {
      this.create({ on: false })
      this.stateMachine.flushUpdates()

      this.stateMachine.setState({ on: true })
      this.stateMachine.setState({ on: false })
      this.stateMachine.setState({ on: true })
      this.stateMachine.flushUpdates()

      this.stateMachine.setState({ on: false })
      this.stateMachine.flushUpdates()

      expect(this.offToOn).to.have.been.calledOnce
      expect(this.onToOff).to.have.been.calledOnce
    })

    it('should call receive props when the state is the same', function () {
      this.create({ on: false })
      this.stateMachine.flushUpdates()

      this.stateMachine.setState({ on: true })
      this.stateMachine.flushUpdates()

      this.stateMachine.setState({ on: true })
      this.stateMachine.flushUpdates()

      expect(this.offToOn).to.have.been.calledOnce
      expect(this.onToOn).to.have.been.calledOnce
    })

  })

})
