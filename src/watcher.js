import fs from 'fs'
import path from 'path'
import React from 'react'

require.uncache = (moduleName) => {
  require.searchCache(moduleName, mod => {
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
      console.log('Files changed, reloading...')

      // start at root component and uncache
      require.uncache(path.resolve(app.rootPath))

      // now load again
      app.mainComponent = require(path.resolve(app.rootPath))

      // force update
      app.rootInstance.forceUpdate()
    })
  }
}
