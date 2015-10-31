function msFromBPM(bpm) {
  return 1000 * 60 / bpm
}

let lastBeatTime, lastBeatTap, beatTapChain

export const BeatEngine = {

  ms: 1000,
  currentBeat: 0,
  beatBasedAnimations: [],

  start(initialBPM) {
    this.setBPM(initialBPM)

    setTimeout(this.performBeat.bind(this), this.ms)
  },

  setBPM(bpm) {
    this.ms = msFromBPM(bpm)
  },

  tapBeat() {
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

    if (timeSinceLastBeat < previousMs && timeSinceLastBeat > (oldMs * .5)) {
      this.performBeat()
    }
  },

  performBeat() {
    const now = Date.now()

    lastBeatTime = now
    this.currentBeat++

    console.log('Performing beat', this.currentBeat)

    const animations = this.beatBasedAnimations

    for (const animation of animations) {
      const activeAction = animation.activeActions[0]

      animation._beatDuration = this.ms * animation.beat

      for (const valueKey in animation.values) {
        animation.values[valueKey].duration = this.ms * animation.beat
      }

      if (!activeAction) continue

      activeAction.duration = this.ms * animation.beat

      // if beat is 1 or over, restart on appropriate beat
      if (animation.beat >= 1 && this.currentBeat % animation.beat === 0) {
        if (activeAction.playDirection === 1 && activeAction.yoyo) {
          activeAction.elapsed = activeAction.duration
        } else {
          activeAction.elapsed = 0
        }
      }
    }

    setTimeout(this.performBeat.bind(this), this.ms)
  },

}
