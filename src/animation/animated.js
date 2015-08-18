import React from 'react'
import tweenFunctions from 'tween-functions'
import AnimatedMovement from './movement'
import AnimatedStepper from './stepper'
import AnimatedValue from './value'

export function Animated(Component) {
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
Animated.Movement = AnimatedMovement
Animated.Stepper = AnimatedStepper
Animated.Value = AnimatedValue
