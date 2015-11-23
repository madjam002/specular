specular
========

*This project is a work in progress, website coming soon! It has been released early to get feedback.*

> <font size="4"> Custom renderers for [React](https://github.com/facebook/react). Build light shows, control devices, and more!<font>

Specular is a platform which allows you to use [React](https://github.com/facebook/react) to render to targets other than the DOM.
Can run in NodeJS, or alongside React in the browser (depending on the renderer you use).
Whilst Specular started off as a library to control physical hardware, it can be used for anything, including your web based adventures!

The core module itself (`specular`) which provides the platform is very lightweight and can be used for doing any kind of custom rendering
that isn't mentioned here e.g rendering to WebGL or even OpenGL using NodeJS bindings, controlling and listening to serial interfaces,
and anything else your mind can think of!

There are several pre-made renderers available today which are part of this repository.

---

#### specular-dmx
&check; Browser (partial) &check; NodeJS

Allows you to build light shows using React and output them to real light fixtures using DMX and Artnet*.

*docs coming soon*

<small>* ArtNet output is only supported in NodeJS. You can use `specular-visualiser` (not yet released) to visualise
DMX output in the browser using WebGL.</small>

---

#### specular-midi
&cross; Browser &check; NodeJS

Control and interact with MIDI devices like the Novation Launchpad and the APC Mini. Can also be used to control MIDI keyboards and other instruments.
Uses the `midi` npm module, meaning it only runs on NodeJS.

*docs coming soon*

---

*More coming soon...*

---

## Getting started

```sh
$ npm install react specular --save
```

Congratulations, you've just opened up a whole world of possibilities. :tada: :tada: :tada:

Now you can follow one of the getting started guides below:

- [A step by step guide on building a custom renderer (using canvas as an example)](docs/building-a-renderer.md)
- *Build a light show using specular-dmx (coming soon)*
- *Control MIDI devices with specular-midi (coming soon)*

### Barebones example to get started

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

There's a few things to note here.

- The `<Scene>` component is the `<div>` of the Specular world. It is simply a container element which allows you to render children.
Unlike a `<div>` however, it doesn't effect the actual render output.
If you render a component inside or outside of a `<Scene>`, it will make no difference, it is simply provided as a container component.

- `Specular.render()` takes a tree of elements like `ReactDOM.render`, but unlike `ReactDOM` it doesn't take a DOM node to mount to. Instead you provide a list of render targets as the second argument (see below).


### Renderers (or render targets)

Specular allows you to render the same React tree to multiple render targets. This could be useful if it made sense to combine components which output to different renderers. For example, you might want to use `specular-dmx` to build a light show to output to DMX lighting fixtures, but at the same time use `specular-midi` to output to devices which are controlled via MIDI.

A renderer can be thought of as a render pass.
Every time a component in your React tree updates, it triggers Specular to re-render.

Specular then goes through the render targets that you provided (in the same order), and passes the React tree to the renderer for it to work its magic.

A renderer passed to `Specular.render` is simply an object which has some different render pass hooks to do its processing on. The hooks available are:

#### `before`
Called before iterating through the React tree.
Can be useful for "preparing" to render to whatever you're rendering to. In the case of canvas, it'll be used to clear the canvas context so we can start to draw stuff to it.

#### `render(ReactComponent)`
Gets called for each React Component in your React tree. This is useful for actually rendering something for each component. It's called in the same order that your components are rendered in the React tree.

#### `after`
Called after rendering each component, useful for cleaning up or finishing the render process.

The renderers provided in this repository all implement these hooks appropriately. You can see the source code for more details on how it works.

### Using a renderer

In `index.js`:

```javascript
import React from 'react'
import Specular, {Scene} from 'specular'
import SpecularDMX from 'specular-dmx'
import ArtNet from 'specular-dmx-artnet'

const renderTargets = [
  SpecularDMX({
    /* Config for SpecularDMX, sets DMX universe 0 to output to ArtNet */
    0: ArtNet('127.0.0.1')
  })
]

Specular.render(
  <Scene>
    {/* Components will go here */}
  </Scene>
, renderTargets)
```

## License

Licensed under the MIT License.

View the full license [here](https://raw.githubusercontent.com/specularjs/specular/master/LICENSE).
