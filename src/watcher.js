import fs from 'fs'
import path from 'path'
import {React} from './react'

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

export function Watcher(watchDir) {
  return function (app) {
    fs.watch(watchDir, {recursive: true}, e => {
      // get state of components
      let state = React.getTreeState() //NOT USED YET

      console.log('Files changed, unloading components')

      // start at root component and unload
      require.uncache(path.resolve(app.rootPath))

      // now load again
      const mainComponent = require(path.resolve(app.rootPath))

      // for now just unmount all so that everything is remounted
      // TODO think about keeping state in the future?
      React.unmountAll()

      app.rootElement = React.createElement(mainComponent, app.rootElement.props)
    })
  }
}
