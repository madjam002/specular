import tweenFunctions from 'tween-functions'
import {Beat} from './beat'
import {EventEmitter} from 'events'

/*
Usage

new Animation({
  from: 0,
  to: 255,
  easing: Animation.Easing.linear,

  delay: 1000,
  startDelay: 1000,

  beatDelay: 1,
  startBeatDelay: 2,

  time: 200, // ms OR
  beat: 1,

  repeat: Infinity,
  yoyo: true,
})

// or more advanced...

new Animation({
  points: [
    {
      value: { x: 0, y: 128 },
      easing: Animation.Easing.linear,
      until: 0.2,
      delay: 0.1,
    },
    {
      ... etc
    }
  ],

  // then same options as above
})

*/

export class Animation {

  static Easing = tweenFunctions

  static Movement = {
    Circle(opts = {}) {
      opts.radius = opts.radius || 128
      opts.xOffset = opts.xOffset || 128
      opts.yOffset = opts.yOffset || 128

      return (progress) => {
        let angle = progress * 6.28318531
        return { x: opts.xOffset + Math.cos(angle) * opts.radius, y: opts.yOffset + Math.sin(angle) * opts.radius }
      }
    },

    Lissajous(opts = {}) {
      opts.m = opts.m || 1
      opts.n = opts.n || 2
      opts.phase = opts.phase || 0
      opts.width = opts.width || 255
      opts.height = opts.height || 255

      return (progress) => {
        progress *= Math.PI
        let x = opts.width * Math.sin(opts.m * progress)
        let y = opts.height * Math.sin(opts.n * progress + opts.phase)
        return { x: x, y: y }
      }
    }
  }

  static all = []
  static beatOnly = []

  static updateAll(time) {
    for (let anim of Animation.all) {
      anim.update(time)
    }
  }

  constructor(opts) {
    // if from and to provided, create points
    if (opts.points) {
      this.points = opts.points
    } else if (opts.from !== undefined && opts.to !== undefined) {
      this.points = [
        { value: opts.from, easing: opts.easing, from: 0, until: 1 },
        { value: opts.to },
      ]
    }

    if (opts.function) {
      this.function = opts.function
      this.value = {}
    } else {
      this.value = 0
    }

    this.autoStart = opts.autoStart
    if (this.autoStart === undefined) this.autoStart = true

    this.delay = opts.delay
    this.startDelay = opts.startDelay
    this.beatDelay = opts.beatDelay
    this.startBeatDelay = opts.startBeatDelay

    this.duration = opts.time
    this.beat = opts.beat

    this.repeat = opts.repeat
    this.yoyo = opts.yoyo
    this.reversed = opts.reversed

    this.events = new EventEmitter()

    if (this.autoStart) this.start()
  }

  on(event, callback) {
    this.events.on(event, callback)
  }

  off(event, callback) {
    this.events.removeListener(event, callback)
  }

  // Start this easing function
  start() {
    if (this.startDelay && !this.beat) {
      setTimeout(() => {
        this._start()
      }, this.startDelay)
    } else {
      this._start()
    }

    return this
  }

  _start() {
    this.running = true
    this.startTime = Date.now()
    this.currentPointIndex = 0
    this.currentPointStartTime = Date.now()

    if (this.beat) {
      // ok, this is gonna be hard
      let currentBeat = Beat.currentBeat
      let beatStartTime = Beat.lastBeatTime
      let beatEstEndTime = beatStartTime + Beat.ms
      let now = Date.now()
      let beatProgress = (now - beatStartTime) / (beatEstEndTime - beatStartTime)
      let myBeatStartTime = Beat.previousBeats[currentBeat - (currentBeat % this.beat)]
      let myProgress = beatProgress * this.beat

      if (!myBeatStartTime) {
        // no previous beats, it has to be an estimate
        myBeatStartTime = Date.now() - (currentBeat * Beat.ms)
      }

      this.startTime = myBeatStartTime
      if (this.startDelay) this.startTime += this.startDelay
      this.duration = Beat.ms * this.beat

      // TODO do we need to set the current point based on progress?
      // seems to work for now as is.
    }

    Animation.all.push(this)
    if (this.beat) Animation.beatOnly.push(this)

    this.events.emit('start')

    return this
  }

  restart(beatCheck = false) {
    if (beatCheck) {
      if (this.beat && this.beat >= 1) return
    }

    this.startTime = Date.now()
    if (this.yoyo) this.reversed = !this.reversed

    if (this.points) {
      if (this.reversed) {
        this.currentPointIndex = this.points.length - 2
        this.currentPointStartTime = Date.now()
      } else {
        this.currentPointIndex = 0
        this.currentPointStartTime = Date.now()
      }
    }

    this.events.emit('start')

    return this
  }

  stop() {
    this.running = false
    Animation.all.splice(Animation.all.indexOf(this), 1)
    Animation.beatOnly.splice(Animation.beatOnly.indexOf(this), 1)

    this.events.removeAllListeners('start')

    return this
  }

  nextPoint() {
    if (this.reversed && this.currentPointIndex > 0) {
      this.currentPointIndex--
      this.currentPointStartTime = Date.now()
    } else if (this.currentPointIndex < (this.points.length - 1)) {
      this.currentPointIndex++
      this.currentPointStartTime = Date.now()
    }
  }

  getCurrentPoint() {
    return this.points[this.currentPointIndex]
  }

  getPointDuration() {
    let point = this.getCurrentPoint()
    return point.until - point.from
  }

  getNextPoint() {
    if (this.reversed && this.currentPointIndex > 0) {
      return this.points[this.currentPointIndex - 1]
    } else if (this.currentPointIndex < (this.points.length - 1)) {
      return this.points[this.currentPointIndex + 1]
    }
  }

  getPreviousPoint() {
    if (this.reversed && this.currentPointIndex < (this.points.length - 1)) {
      return this.points[this.currentPointIndex + 1]
    } else if (this.currentPointIndex > 0) {
      return this.points[this.currentPointIndex - 1]
    }
  }

  getToValue() {
    if (this.reversed && this.getCurrentPoint() != null) {
      return this.getCurrentPoint().value
    } else if (this.getNextPoint() != null) {
      return this.getNextPoint().value
    } else {
      return 0
    }
  }

  getFromValue() {
    if (this.reversed) {
      return this.getPreviousPoint().value
    } else {
      return this.getCurrentPoint().value
    }
  }

  updateValue(easingFunction, progress) {
    let firstValue = this.points[0].value
    let from = this.getFromValue()
    let to = this.getToValue()

    if (!isNaN(firstValue)) {
      // simple number
      this.value = easingFunction(progress, from, to, 1)
    } else if (typeof firstValue === 'string') {
      this.value = from
    } else {
      // object!
      this.value = {}
      for (let prop in firstValue) {
        if (isNaN(firstValue[prop])) continue
        this.value[prop] = easingFunction(progress, from[prop], to[prop], 1)
      }
    }
  }

  // Update this easing function
  update(time) {
    if (!this.running) return

    // get progress of animation
    let progress = (time - this.startTime) / this.duration
    progress = progress > 1 ? 1 : progress

    // function based?
    if (this.function) {
      this.value = this.function(this.reversed ? 1 - progress : progress)

      if (progress >= 1 && (!this.beat || this.beat < 1)) {
        // TODO pay attention to repeat options
        this.restart(true)
      }

      return
    }

    // point based

    // get progress of animation through point
    let currentPoint = this.getCurrentPoint()
    let pointProgress = ((this.reversed ? 1 - progress : progress) - currentPoint.from) / this.getPointDuration()
    if (this.reversed) pointProgress = 1 - pointProgress

    // move to next point?
    if (this.reversed && pointProgress >= 1) {
      if (this.currentPointIndex === 0) {
        // restart
        this.value = currentPoint.value
        this.restart(true)
        return
      }

      this.nextPoint()
      pointProgress = 0
      currentPoint = this.getCurrentPoint()
    } else if (!this.reversed && pointProgress >= 1 && this.currentPointIndex < (this.points.length - 1)) {
      this.nextPoint()
      pointProgress = 0
      currentPoint = this.getCurrentPoint()

      // last point?
      if (this.currentPointIndex === (this.points.length - 1)) {
        this.value = currentPoint.value
        this.restart(true)
        return
      }
    }

    // get value through point
    let easingFunction = currentPoint.easing !== undefined ? currentPoint.easing : tweenFunctions.linear
    if (easingFunction === false) easingFunction = Animation.Easing.none
    this.updateValue(easingFunction, pointProgress)

    if (progress >= 1 && (!this.beat || this.beat < 1)) {
      console.log('shouldnt get here?')
      // restart
      // TODO pay attention to repeat options
      this.restart(true)
    }
  }

}

Animation.Easing.none = function(t, b, _c, d) {
  if (t === d) return _c
  else return b
}
