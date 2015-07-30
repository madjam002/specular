import tweenFunctions from 'tween-functions'
import {Beat} from '../beat'
import _ from 'lodash'
import Stepper from './stepper'

export default class AnimatedValue {

  static all = []

  static updateAll(time) {
    for (let anim of AnimatedValue.all) {
      anim.update(time)
    }
  }

  constructor(opts) {
    this.from = opts.from
    this.to = opts.to
    this._easing = tweenFunctions.linear
    this._yoyo = true
    this._ms = 500
    this._delay = 0
  }

  // Configuration

  every(amount) {
    const anim = this

    return {
      beats() {
        anim._beat = amount
        return anim
      },

      ms() {
        anim._ms = amount
        return anim
      }
    }
  }

  delay(ms) {
    this._delay = ms
    return this
  }

  easing(func) {
    if (func === false) {
      this._easing = tweenFunctions.none
    } else {
      this._easing = func
    }

    return this
  }

  yoyo(yoyo) {
    this._yoyo = yoyo
    return this
  }

  step(steps = 1) {
    this._easing = Stepper(this._easing, steps)
    return this
  }

  ///

  start() {
    if (this._delay) {
      setTimeout(() => this._start(), this._delay)
    } else {
      this._start()
    }

    // add to beat animation registry
    if (this._beat) {
      Beat.animations.push(this)
    }

    AnimatedValue.all.push(this)

    return this
  }

  _start() {
    const now = Date.now()

    this._startTime = now

    if (this._beat) {
      // we need to progress the animation if it's beat based
      const currentBeat = Beat.currentBeat
      const beatStartTime = Beat.lastBeatTime
      const beatEstEndTime = beatStartTime + Beat.ms
      const beatProgress = (now - beatStartTime) / (beatEstEndTime - beatStartTime)

      let thisStartTime = Beat.previousBeats[currentBeat - (currentBeat % this._beat)]

      if (!thisStartTime) {
        // no previous beats to use to work out start time so it has to be an estimate
        thisStartTime = now - (currentBeat * Beat.ms)
      }

      this._startTime = thisStartTime
      if (this._delay) this._startTime += this._delay
      this._duration = Beat.ms * this._beat
    }
  }

  restart() {
    this._startTime = Date.now()
    if (this._yoyo) this._reversed = !this._reversed

    return this
  }

  dispose() {
    _.remove(AnimatedValue.all, this)
    _.remove(Beat.animations, this)

    return this
  }

  update(time) {
    // get progress of animation
    let progress = (time - this._startTime) / this._duration
    progress = Math.min(progress, 1)

    let { from, to } = this

    // reversed?
    if (this._reversed) {
      from = this.to
      to = this.from
    }

    // get value
    this.value = this._easing(progress, from, to, 1, this._duration)
    this.inverse = 255 - this.value

    // restart the animation if necessary
    // don't restart if this animation is every >1 beats, as the beat manager
    // will handle restarting it.
    if (progress >= 1 && (!this._beat || this._beat < 1)) {
      this.restart()
    }

    return this
  }

}
