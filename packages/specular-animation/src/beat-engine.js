import {restart} from './animation-helpers'

function msFromBPM (bpm) {
  return 1000 * 60 / bpm
}

let lastBeatTime, lastBeatTap, beatTapChain

export const BeatEngine = {

  ms: 0,
  currentBeat: 0,
  beatBasedTweens: [],

  start (initialBPM) {
    this.setBPM(initialBPM)
    this.performBeat()
  },

  setBPM (bpm) {
    this.ms = msFromBPM(bpm)
  },

  tapBeat () {
    const previousMs = this.ms
    const timeSinceLastTap = Date.now() - lastBeatTap
    const timeSinceLastBeat = Date.now() - lastBeatTime

    // discard current tap chain if too long
    if (timeSinceLastTap > 2000) {
      // start new tap chain
      lastBeatTap = Date.now()
      beatTapChain = []
      return
    }

    beatTapChain.push(timeSinceLastTap)

    if (beatTapChain.length > 8) {
      beatTapChain = beatTapChain.slice(1)
    }

    const averageTimeBetweenTaps = beatTapChain.reduce((sum, time) => sum += time) / beatTapChain.length
    this.ms = averageTimeBetweenTaps

    lastBeatTap = Date.now()

    if (timeSinceLastBeat < previousMs && timeSinceLastBeat > (previousMs * 0.5)) {
      this.performBeat()
    }
  },

  performBeat () {
    const now = Date.now()

    lastBeatTime = now
    this.currentBeat++

    console.log('Performing beat', this.currentBeat)

    const tweens = this.beatBasedTweens

    tweens.forEach(tween => {
      tween.duration = this.ms * tween.beat

      if (tween.beat >= 1 && this.currentBeat % tween.beat === 0) {
        if (tween.delay) {
          setTimeout(() => restart(Date.now(), tween), tween.delay)
        } else {
          restart(now, tween)
        }
      }
    })

    setTimeout(this.performBeat.bind(this), this.ms)
  }

}
