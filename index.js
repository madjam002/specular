import {Animation} from './src/animation'
import {React} from './src/react'
import {Beat} from './src/beat'
import fs from 'fs'
import path from 'path'

require.uncache = (moduleName) => {
  require.searchCache(moduleName, mod => {
    console.log('unloaded', mod.id)
    delete require.cache[mod.id]
  })

  Object.keys(module.constructor._pathCache).forEach(cacheKey => {
    if (cacheKey.indexOf(moduleName) > 0) {
      delete module.constructor._pathCache[cacheKey]
    }
  })
}

require.searchCache = (moduleName, callback) => {
  let mod = require.resolve(moduleName)

  if (mod && ((mod = require.cache[mod]) !== undefined)) {
    (function run(mod) {
      mod.children.forEach(child => run(child))

      callback(mod)
    })(mod)
  }
}

export * from './src/fixture'
export * from './src/component'
export * from './src/react'
export * from './src/scene'
export * from './src/create-fixture'
export * from './src/animation'
export * from './src/beat'

let lastRender = Date.now()

let rootElement = null

let renderLoop = (callback) => {
  if ((Date.now() - lastRender) < (1000 / 60)) {
    setImmediate(renderLoop.bind(this, callback))
    return
  }

  let context = {
    result: {}
  }

  try {
    React.render(rootElement, context)
  } catch (ex) {
    console.log('Render Exception', ex.stack || ex.message)
  }

  Beat.update(Date.now())

  Animation.updateAll(Date.now())
  lastRender = Date.now()

  // ensure undefined values are 0
  for (let i = 0; i <= 512; i++) {
    if (!context.result[i]) context.result[i] = 0
  }

  callback(context.result)

  setImmediate(renderLoop.bind(this, callback))
}

export default {
  render(component) {
    let context = {
      result: {}
    }

    component.context = context
    render(component)

    return context.result
  },

  start(element, callback) {
    rootElement = element
    renderLoop(callback)
  },

  startWithWatch(componentPath, props, watchDir, callback) {
    let mainComponent = require(componentPath)
    rootElement = React.createElement(mainComponent, props)

    renderLoop(callback)

    fs.watch(watchDir, {recursive: true}, e => {
      // get state of components
      let state = React.getTreeState() //NOT USED YET

      console.log('Files changed, unloading components')

      // start at root component and unload
      require.uncache(path.resolve(componentPath))

      // now load again
      mainComponent = require(path.resolve(componentPath))

      // for now just unmount all so that everything is remounted
      // TODO think about keeping state in the future?
      React.unmountAll()

      rootElement = React.createElement(mainComponent, rootElement.props)
    })
  },

  setRootProps(props) {
    Object.assign(rootElement.props, props)
  },

  getRootProps() {
    return rootElement.props
  }
}
