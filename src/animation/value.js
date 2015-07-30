import Progressable from './progressable'
import Tweenable from './tweenable'
import tweenFunctions from 'tween-functions'

@Tweenable
@Progressable
export default class AnimatedValue {

  constructor(opts) {
    this.from = opts.from
    this.to = opts.to
    this._easing = tweenFunctions.linear
    this._yoyo = true
    this._ms = 500
    this._delay = 0
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
