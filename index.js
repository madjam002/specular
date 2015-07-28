import React from 'react'
import _ from 'lodash'
import {EventEmitter} from 'events'

import {Animation} from './src/animation'
import {Beat} from './src/beat'
import createContainer from './src/create-container'

export default class Specular extends EventEmitter {
  constructor() {
    super()

    this.universeCount = 0
  }

  use(func) {
    func(this)
  }

  start(path) {
    // !! inb4 Hax !!
    // Because React depends on the DOM at the moment, and I haven't figured out how to
    // build a custom renderer yet, we're going to insert jsdom if this is running in Node.
    // I'm pretty sure this doesn't slow anything down as we're not rendering DOM nodes anyway.
    try {
      let document = null
      global.document = require('jsdom').jsdom()
      global.window = global.document.parentWindow
      global.navigator = { userAgent: '__specular__' }
    } catch (ex) {}
    const dummyContainerNode = document.createElement('div')
    // no more hax beyond this point... (hopefully)

    this.mainComponent = require(path)
    this.rootPath = path

    // create container component
    const containerComponent = createContainer(this)

    Beat.performBeat()

    this.running = true
    this._updateLoop()

    const rootElement = React.createElement(containerComponent, {})
    this.rootInstance = React.render(rootElement, dummyContainerNode)
  }

  _updateLoop() {
    this.update()

    if (this.running)
      setTimeout(this._updateLoop.bind(this), 1000 / 120)
  }

  update() {
    Beat.update(Date.now())
    Animation.updateAll(Date.now())
  }

  setRootProps(props) {
    this.emit('props:update', props)
  }

  getRootProps() {
    return this.rootInstance.getProps()
  }

  queueUpdate() {
    if (this._updateQueued) return
    this._updateQueued = true
    setTimeout(() => this._performUpdate())
  }

  _performUpdate() {
    this._updateQueued = false

    // go through the render tree and collect data
    const universes = new Array(this.universeCount)
    this._renderComponent(universes, this.rootInstance._reactInternalInstance)

    // ensure undefined values are 0
    for (let i = 0; i < universes.length; i++) {
      for (let x = 0; x <= 512; x++) {
        if (!universes[i][x]) universes[i][x] = 0
      }
    }

    this.emit('output', universes)
  }

  _renderComponent(universes, component) {
    if (component._renderedComponent) {
      this._renderComponent(universes, component._renderedComponent)
      return
    }

    if (component.fixtureData && component.fixtureUniverse !== undefined) {
      if (!universes[component.fixtureUniverse]) universes[component.fixtureUniverse] = {}
      this.universeCount = Math.max(this.universeCount, component.fixtureUniverse)
      Object.assign(universes[component.fixtureUniverse], component.fixtureData)
    }

    // process children
    if (component._renderedChildren) {
      const children = component._renderedChildren
      for (let key in children) {
        this._renderComponent(universes, children[key])
      }
    }
  }
}


export * from './src/animation'
export * from './src/beat'
export * from './src/create-fixture'
export * from './src/fixture'
export * from './src/scene'
export * from './src/socket-io'
export * from './src/watcher'

export * from './src/outputs/artnet'
