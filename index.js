import {Animation} from './src/animation'
import {React} from './src/react'
import {Beat} from './src/beat'
import {EventEmitter} from 'events'

export * from './src/fixture'
export * from './src/component'
export * from './src/react'
export * from './src/scene'
export * from './src/create-fixture'
export * from './src/animation'
export * from './src/beat'
export * from './src/watcher'

export * from './src/outputs/artnet'

export default class Specular extends EventEmitter {
  use(func) {
    func(this)
  }

  start(path) {
    const mainComponent = require(path)
    this.rootPath = path
    this.rootElement = React.createElement(mainComponent, {})

    Beat.performBeat()

    this.running = true
    this._renderLoop()
  }

  _renderLoop() {
    this.render()

    if (this.running)
      setTimeout(this._renderLoop.bind(this), 1000 / 120)
  }

  render() {
    let context = {
      result: {}
    }

    try {
      React.render(this.rootElement, context)
    } catch (ex) {
      console.log('Render Exception', ex.stack || ex.message)
    }

    Beat.update(Date.now())

    Animation.updateAll(Date.now())

    // ensure undefined values are 0
    for (let i = 0; i <= 512; i++) {
      if (!context.result[i]) context.result[i] = 0
    }

    this.emit('output', [context.result]) // TODO support more than one universe
  }

  setRootProps(props) {
    Object.assign(this.rootElement.props, props)
  }

  getRootProps() {
    return this.rootElement.props
  }
}
