import remove from 'lodash.remove'

let isRunning = false
const registeredComponents = []
let beatEngine = null

export function startLoop() {
  isRunning = true
  loop()
}

export function stopLoop() {
  isRunning = false
}

export function registerComponent(component) {
  registeredComponents.push(component)

  if (!isRunning) {
    startLoop()
  }
}

export function unregisterComponent(component) {
  remove(registeredComponents, component)
}

export function setBeatEngine(engine) {
  beatEngine = engine
}

function loop() {
  if (isRunning) {
    setTimeout(loop, 1000 / 60)
  }

  const now = Date.now()

  if (beatEngine != null) {
    beatEngine.update(now)
  }

  registeredComponents.forEach(component => component.update(now))
}
