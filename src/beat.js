import {Animation} from './animation'
import {EventEmitter} from 'events'

let nextTimeout = null
let emitter = new EventEmitter()

export var Beat = {
  currentBeat: 0,
  ms: 460,
  lastBeatTime: Date.now(),
  averages: [460],
  previousBeats: {},

  on: emitter.on.bind(emitter),
  off: emitter.removeListener.bind(emitter),

  beat() {
    // if ((Date.now() - Beat.lastBeatTime) < 300) return

    // Beat.ms = Date.now() - Beat.lastBeatTime

    let thisTime = Date.now() - Beat.lastBeatTime

    // discard if too long
    if (thisTime > 2000) {
      Beat.lastBeatTime = Date.now()
      if (nextTimeout) clearTimeout(nextTimeout)
      Beat.performBeat()
      return
    }

    Beat.averages.push(thisTime)
    if (Beat.averages.length > 10)
      Beat.averages = Beat.averages.slice(1)

    let avg = 0
    for (let beatAvg of Beat.averages)
      avg += beatAvg

    Beat.ms = avg / Beat.averages.length

    Beat.lastBeatTime = Date.now()

    console.log('tap', thisTime, 'avg', Beat.ms)

    if (nextTimeout) clearTimeout(nextTimeout)

    Beat.performBeat()
  },

  performBeat() {
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

    emitter.emit('beat')

    nextTimeout = setTimeout(Beat.performBeat, Beat.ms)
  }
}
