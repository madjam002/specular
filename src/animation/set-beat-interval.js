import Progressable from './progressable'

export function setBeatInterval(callback, beats) {
  const interval = new BeatInterval(callback, beats)

  return interval.dispose.bind(interval)
}

@Progressable
class BeatInterval {

  constructor(callback, beats) {
    this._beat = beats
    this._callback = callback

    this.start()
  }

  restarted() {
    // call callback
    this._callback()
  }

  update(time) {
    // get progress
    let progress = (time - this._startTime) / this._duration
    progress = Math.min(progress, 1)

    // restart if necessary
    // don't restart if this animation is every >1 beats, as the beat manager
    // will handle restarting it.
    if (progress >= 1 && (!this._beat || this._beat < 1)) {
      this.restart()
    }
  }

}
