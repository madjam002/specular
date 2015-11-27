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

const beatEngineMock = {
  beatBasedTweens: [],
}

let Animate

describe.only('<Animate /> component', function () {

  beforeEach(function () {
    loopMock.registerComponent = sinon.spy()
    loopMock.unregisterComponentSpy = sinon.spy()

    beatEngineMock.beatBasedTweens = []

    Animate = proxyquire('../animate', {
      './loop': loopMock,
      './beat-engine': { BeatEngine: beatEngineMock },
    }).Animate
  })

  describe('initial state', function () {

    describe('animation with duration', function () {
      beforeEach(function () {
        this.tree = shallowRender(
          <Animate values={{val: 50}}>
            {() => {}}
          </Animate>
        )

        this.tree.getMountedInstance().componentDidMount()
      })

      it('should register the component with the loop', function () {
        expect(loopMock.registerComponent).to.have.been.calledOnce
      })

      it('shouldn\'t register with the beat engine', function () {
        expect(beatEngineMock.beatBasedTweens.length).to.equal(0)
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

    describe('animation with beat', function () {
      beforeEach(function () {
        this.tree = shallowRender(
          <Animate values={{val: { to: 50, beat: 4 }}}>
            {() => {}}
          </Animate>
        )

        this.tree.getMountedInstance().componentDidMount()
      })

      it('should register the component with the loop', function () {
        expect(loopMock.registerComponent).to.have.been.calledOnce
      })

      it('should register the tween with the beat engine', function () {
        const instance = this.tree.getMountedInstance()

        expect(beatEngineMock.beatBasedTweens).to.eql([instance.tweens.val])
      })

      it('should create the tween filling in default props', function () {
        const instance = this.tree.getMountedInstance()

        expect(instance.tweens.val).to.contain({
          yoyo: true,
          easing: 'linear',
          beat: 4,
          to: 50,
          from: 0,
        })
      })
    })

    describe('animation with multiple tweens', function () {
      beforeEach(function () {
        this.tree = shallowRender(
          <Animate values={{x: { to: 50, duration: 300 }, y: { to: 255, beat: 4, yoyo: false }}}>
            {() => {}}
          </Animate>
        )

        this.tree.getMountedInstance().componentDidMount()
      })

      it('should register the beat tween with the beat engine', function () {
        const instance = this.tree.getMountedInstance()

        expect(beatEngineMock.beatBasedTweens).to.eql([instance.tweens.y])
      })

      it('should create the tweens', function () {
        const instance = this.tree.getMountedInstance()

        expect(instance.tweens.x).to.contain({
          yoyo: true,
          easing: 'linear',
          to: 50,
          from: 0,
          duration: 300,
        })

        expect(instance.tweens.y).to.contain({
          yoyo: false,
          easing: 'linear',
          beat: 4,
          to: 255,
          from: 0,
        })
      })
    })

    describe('animation with multiple tweens with inheriting props', function () {
      beforeEach(function () {
        this.tree = shallowRender(
          <Animate values={{x: 50, y: { to: 255, beat: 4, yoyo: true }}} yoyo={false} duration={420} easing="easeInOut">
            {() => {}}
          </Animate>
        )

        this.tree.getMountedInstance().componentDidMount()
      })

      it('should register the beat tween with the beat engine', function () {
        const instance = this.tree.getMountedInstance()

        expect(beatEngineMock.beatBasedTweens).to.eql([instance.tweens.y])
      })

      it('should create the tweens', function () {
        const instance = this.tree.getMountedInstance()

        expect(instance.tweens.x).to.contain({
          yoyo: false,
          easing: 'easeInOut',
          to: 50,
          from: 0,
          duration: 420,
        })

        expect(instance.tweens.y).to.contain({
          yoyo: true,
          easing: 'easeInOut',
          beat: 4,
          to: 255,
          from: 0,
        })
      })
    })

    describe('animation with multiple tweens with inheriting props and from values', function () {
      beforeEach(function () {
        this.tree = shallowRender(
          <Animate from={{x: 12}} values={{x: 50, y: { to: 255, beat: 4, yoyo: true }}} yoyo={false} duration={420} easing="easeInOut">
            {() => {}}
          </Animate>
        )

        this.tree.getMountedInstance().componentDidMount()
      })

      it('should create the tweens', function () {
        const instance = this.tree.getMountedInstance()

        expect(instance.tweens.x).to.contain({
          yoyo: false,
          easing: 'easeInOut',
          to: 50,
          from: 12,
          duration: 420,
        })

        expect(instance.tweens.y).to.contain({
          yoyo: true,
          easing: 'easeInOut',
          beat: 4,
          to: 255,
          from: 0,
        })
      })
    })

  })

  describe('receive props', function () {

    describe('adding beat animation', function () {
      beforeEach(function () {
        let values = {val: { to: 50 }}

        this.tree = shallowRender(
          <Animate values={values}>
            {() => {}}
          </Animate>
        )

        this.tree.getMountedInstance().componentDidMount()

        values = {
          ...values,
          newBeat: { to: 255, beat: 2 },
        }

        this.tree.getMountedInstance().componentWillReceiveProps({ values })
      })

      it('should register the component with the loop', function () {
        expect(loopMock.registerComponent).to.have.been.calledOnce
      })

      it('should register the new tween with the beat engine', function () {
        const instance = this.tree.getMountedInstance()

        expect(beatEngineMock.beatBasedTweens).to.eql([instance.tweens.newBeat])
      })

      it('should create the new tween filling in default props', function () {
        const instance = this.tree.getMountedInstance()

        expect(instance.tweens.newBeat).to.contain({
          yoyo: true,
          easing: 'linear',
          beat: 2,
          to: 255,
          from: 0,
        })
      })
    })

  })

})
