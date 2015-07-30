import tweenFunctions from 'tween-functions'
import Stepper from './stepper'

export default function(tweenable) {
  Object.assign(tweenable.prototype, {
    easing(func) {
      if (func === false) {
        this._easing = tweenFunctions.none
      } else {
        this._easing = func
      }

      return this
    },

    step(steps = 1) {
      this._easing = Stepper(this._easing, steps)
      return this
    }
  })
}
