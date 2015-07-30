import Progressable from './progressable'
import Circle from './movements/circle'

@Progressable
export default class AnimatedMovement {

  static Circle = Circle

  constructor(func) {
    this._function = func
  }

  update(time) {
    // get progress of animation
    let progress = (time - this._startTime) / this._duration
    progress = Math.min(progress, 1)

    // reversed?
    if (this._reversed) {
      progress = 1 - progress
    }

    // get value
    this.value = this._function(progress)

    // restart the animation if necessary
    // don't restart if this animation is every >1 beats, as the beat manager
    // will handle restarting it.
    if (progress >= 1 && (!this._beat || this._beat < 1)) {
      this.restart()
    }

    return this
  }

}
