Building a custom React renderer
================================

*This tutorial is lacking screenshots and hasn't been checked to see if it works, it will be updated soon!*

Once you have got the core Specular module installed, you're probably looking to start doing some cool stuff.
In this tutorial, we are going to wrap the Canvas API and draw some stuff on the page.

## 1. Setting up Specular

Make sure you have the Specular barebones ready to go:

`index.js`:

```javascript
import React from 'react'
import Specular, {Scene} from 'specular'

const renderTargets = []

Specular.render(
  <Scene>
    {/* Components will go here */}
  </Scene>
, renderTargets)
```

## 2. Building the renderer

Create a new folder called `canvas-renderer` and an `index.js` inside it.

`canvas-renderer/index.js`:

```javascript
import {Line} from './line'

export {Line} from './line'

export default function (canvas, ctx) {
  return {
    before() {
      // called before rendering any components, we need to clear the canvas!
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    },

    render(component) {
      // called for each component which is in the react render tree
      if (component instanceof Line) {
        component.draw(canvas, ctx)
      }
    },

    after() {
      // called after rendering all components, we don't need to use this here, but it's useful to do any cleanup
      // work here.
    },
  }
}
```

`canvas-renderer/line.js`:

```javascript
import React from 'react'
import Specular, {LeafComponent} from 'specular'

@LeafComponent
export class Line extends React.Component {

  static defaultProps = {
    toX: 300,
    toY: 150,
  }

  constructor(element) {
    super(element)

    // any constructor work can go here...
  }

  onComponentMount(props, context) {
    // any mounting work can go here...
  }

  onComponentUnmount(props) {
    // any unmounting work can go here...
  }

  onComponentReceiveProps(nextProps, prevProps, context) {
    // on receiving new props...
    // You need to tell specular to re-render the react tree when something changes which you know
    // will affect the render output. For example:

    if (nextProps.toX !== prevProps.toX || nextProps.toY !== prevProps.toY) {
      this.specularQueueUpdate()
    }
  }

  draw(canvas, ctx) {
    const { props } = this._currentElement

    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(props.toX, props.toY)
    ctx.stroke()
  }

}
```

## 3. Wiring it all up

Let's go back to `index.js`, add your new render target and try rendering a `<Line />` component:

```javascript
import React from 'react'
import Specular, {Scene} from 'specular'

import CanvasRenderer, {Line} from './canvas-renderer'

const canvas = document.createElement('canvas')
canvas.style.width = '100%'
canvas.style.height = '100%'
document.body.appendChild(canvas)

const renderTargets = [
  CanvasRenderer(canvas, canvas.getContext('2d'))
]

Specular.render(
  <Scene>
    <Line />
  </Scene>
, renderTargets)
```

You should see a line on the screen!
