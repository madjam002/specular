specular-animation
========

> Beat and time based animation/tweening engine for React and Specular.

## Installation

```sh
$ npm install specular-animation
```

## Example usage

```javascript
import React from 'react'
import Specular, {Scene} from 'specular'
import {Animate} from 'specular-animation'

import AnotherComponent from './another-component'

export default class SomeComponent extends React.Component {

  render() {
    return (
      <Animate values={{x: 255, y: { to: 128, duration: 150 }}} duration={300} easing="easeInOut">
        {({x, y}) => {
          <AnotherComponent x={x} y={y} />
        }}
      </Animate>
    )
  }

}
```

## API

### `<Animate />`

### Props

#### `values: object`

Values takes an object with the keys being the names of the keys you want to be animated.

Each key then contains a configuration object, or a number which will cause the configuration object to default to:

`{ to: [number] }`

##### `to: number`

Value to animate to.

##### `yoyo: boolean = true`

If set to true, will animate to the `to` value, and then reverse and animate back to the starting value. This process will be repeated.

##### `easing: string = 'linear'`

The easing function to use for animation.
List of available functions:

- false (as a boolean - causes the animation to not tween)
- linear
- easeInQuad
- easeOutQuad
- easeInOutQuad
- easeInCubic
- easeOutCubic
- easeInOutCubic
- easeInQuart
- easeOutQuart
- easeInOutQuart
- easeInQuint
- easeOutQuint
- easeInOutQuint
- easeInSine
- easeOutSine
- easeInOutSine
- easeInExpo
- easeOutExpo
- easeInOutExpo
- easeInCirc
- easeOutCirc
- easeInOutCirc
- easeInElastic
- easeOutElastic
- easeInOutElastic
- easeInBack
- easeOutBack
- easeInOutBack
- easeInBounce
- easeOutBounce
- easeInOutBounce

##### `duration: number = 500`

The duration of the animation in ms.

##### `delay: number = 0`

Delays the animation from starting in ms.

##### `beat: number`

If set, will complete the animation in the amount of beats provided.
This will ignore the `duration` config option if set.
The BPM (beats per minute) is determined by calling `BeatEngine.start(initialBPM: number)`.

Example:

```javascript
import {BeatEngine} from 'specular-animation'

BeatEngine.start(130)
```

---

All of the configuration options mentioned above for the values can be used as
top level props which will cause them to be applied to all animation values.
Setting them on the individual values will override these.
