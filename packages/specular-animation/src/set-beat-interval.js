import {registerComponent, unregisterComponent} from './loop'
import {BeatEngine} from './beat-engine'

export function setBeatInterval(callback, beats) {
  const interval = new BeatInterval(callback, beats)

  return interval.dispose.bind(interval)
}

class BeatInterval {

  constructor(callback, beats) {
    this.beat = beats
    this._callback = callback

    registerComponent(this)
  }

  dispose() {
    unregisterComponent(this)
  }

  update(time) {
    const { currentBeatDecimal } = BeatEngine

    const progress = currentBeatDecimal % this.beat

    if (progress < this._lastProgress) {
      this._callback()
      this.lastBeatCallback = currentBeatDecimal
    }

    this._lastProgress = progress

  }

}
