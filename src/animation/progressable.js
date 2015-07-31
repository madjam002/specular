import {Beat} from '../beat'
import {AnimationRegistry} from './registry'

export default function(progressable) {
  Object.assign(progressable.prototype, {
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
    },

    delay(ms) {
      this._delay = ms
      return this
    },

    yoyo(yoyo) {
      this._yoyo = yoyo
      return this
    },

    start() {
      if (this._delay) {
        setTimeout(() => this._start(), this._delay)
      } else {
        this._start()
      }

      // initial update
      this.update(Date.now())

      // add to animation registry
      AnimationRegistry.add(this, this._beat !== undefined)

      return this
    },

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

      if (this._ms) {
        // set duration if ms
        this._duration = this._ms
      }
    },

    restart() {
      this._startTime = Date.now()
      if (this._yoyo) this._reversed = !this._reversed

      if (this.restarted) this.restarted()

      return this
    },

    dispose() {
      AnimationRegistry.remove(this)

      return this
    },
  })
}
