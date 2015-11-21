import tweenFunctions from 'tween-functions'
import {BeatEngine} from './beat-engine'

function noEasing(t, b, _c, d) {
  if (t === d) return _c
  else return b
}

export function updateTween (now, tween) {
  if (!tween._startTime) {
    return
  }

  // progress of animation
  const progress = Math.min((now - tween._startTime) / tween.duration, 1)

  let { from, to } = tween

  // flip from and to if animation is reversed
  if (tween._reversed) {
    from = tween.to
    to = tween.from
  }

  // get value from easing function
  if (!tween.easing) {
    tween._currentValue = noEasing(progress, from, to, 1, tween.duration)
  } else {
    tween._currentValue = tweenFunctions[tween.easing](progress, from, to, 1, tween.duration)
  }

  // restart the animation if necessary
  // don't restart if this animation is every >1 beats, as the beat manager
  // will handle restarting it.
  if (progress >= 1 && (!tween.beat || tween.beat < 1)) {
    restart(now, tween)
  }
}

export function start (tween) {
  if (tween.delay && !tween.beat) {
    setTimeout(() => doStart(tween), tween.delay)
  } else {
    doStart(tween)
  }
}

export function restart (now, tween) {
  tween._startTime = now

  if (tween.yoyo) {
    tween._reversed = !tween._reversed
  }
}

function doStart (tween) {
  const now = Date.now()

  tween._startTime = now

  if (tween.beat) {
    // animation needs to have started now - current ms since last beat
    const { currentBeat, lastBeatTime, ms } = BeatEngine
    const startBeat = currentBeat - (currentBeat % tween.beat)
    const beatsIn = currentBeat - startBeat
    const startTime = lastBeatTime - (ms * beatsIn)

    tween._startTime = startTime

    if (tween.delay) {
      tween._startTime += tween.delay
    }

    tween.duration = tween.beat * ms
  }
}
