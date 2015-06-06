import {Animation} from './animation'
import {EventEmitter} from 'events'

let emitter = new EventEmitter()

export var Beat = {
  currentBeat: 0,
  ms: 460,
  lastBeatTime: Date.now(),
  lastBeatTap: Date.now(),
  averages: [460],
  previousBeats: [],

  on: emitter.on.bind(emitter),
  off: emitter.removeListener.bind(emitter),

  beat() {
    let oldMs = Beat.ms
    let thisTime = Date.now() - Beat.lastBeatTap
    let beatProgress = Date.now() - Beat.lastBeatTime

    // discard if too long
    if (thisTime > 2000) {
      Beat.lastBeatTap = Date.now()
      return
    }

    Beat.averages.push(thisTime)
    if (Beat.averages.length > 20)
      Beat.averages = Beat.averages.slice(1)

    let avg = 0
    for (let beatAvg of Beat.averages)
      avg += beatAvg

    Beat.ms = avg / Beat.averages.length

    console.log('tap', thisTime, 'avg', Beat.ms)

    Beat.lastBeatTap = Date.now()

    if (beatProgress < oldMs && beatProgress > (oldMs * .5)) {
      Beat.performBeat()
    }
  },

  reset() {
    let barProg = Beat.currentBeat % 4
    let lastBarBeat = Beat.currentBeat - barProg
    Beat.currentBeat = lastBarBeat
    Beat.previousBeats = Beat.previousBeats.slice(0, lastBarBeat)
  },

  performBeat() {
    Beat.lastBeatTime = Date.now()
    Beat.currentBeat++
    console.log('Performing beat', Beat.currentBeat)
    Beat.previousBeats[Beat.currentBeat] = Date.now()
    let animations = Animation.beatOnly
    let time = Date.now()

    for (let anim of animations) {
      anim.duration = Beat.ms * anim.beat

      if (anim.beat >= 1 && Beat.currentBeat % anim.beat === 0) {
        if (anim.startDelay) {
          setTimeout(() => {
            anim.restart()
          }, anim.startDelay)
        } else {
          anim.restart()
        }
      } else if (anim.beat < 1) {
        anim.duration = Beat.ms * anim.beat
      }
    }

    emitter.emit('beat', {beat: Beat.currentBeat, ms: Beat.ms})
  },

  update(now) {
    if (now >= (Beat.lastBeatTime + Beat.ms)) Beat.performBeat()
  },
}
