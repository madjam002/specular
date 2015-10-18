import React from 'react'
import _ from 'lodash'
import tweenFunctions from 'tween-functions'
import AnimatedMovement from './movement'
import AnimatedStepper from './stepper'
import AnimatedValue from './value'

export function Animated(Component) {
  return class AnimationWrapper extends React.Component {
    static defaultProps = Component.defaultProps || {}

    componentWillUnmount() {
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

Animated.createComponent = function (animated) {
  @Animated
  class AnimatedComponent extends React.Component {
    constructor(props) {
      super(props)

      this.animated = new animated.constructor()
      Object.assign(this.animated, animated)

      if (props.delay != null) this.animated.delay(props.delay)

      this.animated.start()
    }

    render() {
      return this.props.children(this.animated.value)
    }
  }

  return AnimatedComponent
}
