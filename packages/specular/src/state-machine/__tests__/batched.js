/* eslint-env mocha */

import chai, {expect} from 'chai'
import sinon from 'sinon'
import {BatchedStateMachine} from '../batched'
import {createStateMachineConfig} from '../create-config'

chai.use(require('sinon-chai'))

describe('BatchedStateMachine', function () {

  beforeEach(function () {
    this.initialOn = sinon.spy()
    this.initialOff = sinon.spy()
    this.offToOn = sinon.spy()
    this.onToOff = sinon.spy()
    this.offToOff = sinon.spy()

    this.create = initialState => {
      this.config = createStateMachineConfig({
        initialState,

        on: {
          fn: () => this.initialOn(),

          toOff: {
            to: 'off',
            fn: () => this.onToOff(),
          },
        },
        off: {
          fn: () => this.initialOff(),

          toOn: {
            to: 'on',
            fn: () => this.offToOn(),
          },

          stayOff: {
            to: 'off',
            fn: () => this.offToOff(),
          },
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

    it('shouldn\'t call the initial method on the first state if updates haven\'t been flushed', function () {
      this.create('off')

      expect(this.initialOff).to.not.have.been.called
    })

    it('should call the initial method on the first state if updates have been flushed', function () {
      this.create('off')
      this.stateMachine.flushUpdates()

      expect(this.initialOff).to.have.been.called
    })

    it('should call the initial method on the first state after many changes if updates have been flushed', function () {
      this.create('off')
      this.stateMachine.toOn()
      this.stateMachine.flushUpdates()

      expect(this.initialOn).to.have.been.called
      expect(this.initialOff).to.not.have.been.called
      expect(this.offToOn).to.not.have.been.called
    })

  })

  describe('travelling between states', function () {

    it('should transition to a new state', function () {
      this.create('off')
      this.stateMachine.flushUpdates()

      this.stateMachine.toOn()
      this.stateMachine.toOff()
      this.stateMachine.toOn()
      this.stateMachine.flushUpdates()

      this.stateMachine.toOff()
      this.stateMachine.flushUpdates()

      expect(this.initialOff).to.have.been.called
      expect(this.initialOn).to.not.have.been.called

      expect(this.offToOn).to.have.been.calledOnce
      expect(this.onToOff).to.have.been.calledOnce
    })

    it('should be able to transition to itself', function () {
      this.create('off')
      this.stateMachine.flushUpdates()

      this.stateMachine.stayOff()
      this.stateMachine.flushUpdates()

      expect(this.initialOff).to.have.been.called
      expect(this.offToOff).to.have.been.called
    })

  })

})
