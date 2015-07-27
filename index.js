import React from 'react'
import _ from 'lodash'
import {EventEmitter} from 'events'

import {Animation} from './src/animation'
import {Beat} from './src/beat'
import createContainer from './src/create-container'

export default class Specular extends EventEmitter {
  constructor() {
    super()

    this.universeLayers = []
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

    const universes = []

    for (let i = 0; i < this.universeLayers.length; i++) {
      universes[i] = {}

      const layers = this.universeLayers[i]
      for (let layerID in layers) {
        Object.assign(universes[i], layers[layerID])
      }

      // ensure undefined values are 0
      for (let x = 0; x <= 512; x++) {
        if (!universes[i][x]) universes[i][x] = 0
      }
    }

    this.emit('output', universes)
  }

  addUniverseLayer(universe) {
    if (!this.universeLayers[universe]) this.universeLayers[universe] = {}

    const layerID = _.size(this.universeLayers[universe]) + 1
    this.universeLayers[universe][layerID] = {}

    this.queueUpdate()

    return layerID
  }

  updateUniverseLayer(universe, layerID, data) {
    this.universeLayers[universe][layerID] = data
    this.queueUpdate()
  }

  removeUniverseLayer(universe, layerID) {
    delete this.universeLayers[universe][layerID]
    this.queueUpdate()
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

export * as React from 'react'
export {Component} from 'react'
