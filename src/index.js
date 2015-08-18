import React from 'react'
import _ from 'lodash'
import {EventEmitter} from 'events'

import {Animation} from './animation'
import {AnimationRegistry} from './animation/registry'
import {Beat} from './beat'
import createContainer from './create-container'
import {render} from './renderer/render'

export default class Specular extends EventEmitter {
  constructor() {
    super()

    this.universeCount = 0
  }

  use(func) {
    func(this)
  }

  start(path) {
    this.mainComponent = require(path)
    this.rootPath = path

    // create container component
    const containerComponent = createContainer(this)

    Beat.performBeat()

    this.running = true
    this._updateLoop()

    const rootElement = React.createElement(containerComponent, {})
    this.rootInstance = render(rootElement)
  }

  _updateLoop() {
    this.update()

    if (this.running)
      setTimeout(this._updateLoop.bind(this), 1000 / 120)
  }

  update() {
    Beat.update(Date.now())
    Animation.updateAll(Date.now())
    AnimationRegistry.updateAll(Date.now())
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


export * from './animation'
export * from './beat'
export * from './create-fixture'
export * from './fixture'
export * from './scene'
export * from './sequencer'
export * from './socket-io'
export * from './watcher'

export * from './animation/animated'
export * from './animation/registry'
export * from './animation/set-beat-interval'

export * from './outputs/artnet'
