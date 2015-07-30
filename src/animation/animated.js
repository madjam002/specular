import React from 'react'
import tweenFunctions from 'tween-functions'
import AnimatedValue from './value'
import AnimatedStepper from './stepper'

export function Animated(Component) {
  Component.prototype.tweens = {}

  return class AnimationWrapper extends React.Component {
    componentWillMount() {
      this.interval = setInterval(() => this.forceUpdate(), 1000 / 120)
    }

    componentWillUnmount() {
      clearInterval(this.interval)

      // dispose of animations
      if (this.refs.component && this.refs.component.state) {
        const compState = this.refs.component.state

        for (let key in compState) {
          if (compState.hasOwnProperty(key) && compState[key].dispose) {
            compState[key].dispose()
          }
        }
      }
    }

    render() {
      return React.createElement(Component, {ref: 'component', ... this.props})
    }
  }
}

Animated.Easing = tweenFunctions
Animated.Value = AnimatedValue
Animated.Stepper = AnimatedStepper
