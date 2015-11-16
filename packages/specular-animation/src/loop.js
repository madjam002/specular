let isRunning = false
let registeredComponents = []

export function startLoop () {
  isRunning = true
  loop()
}

export function stopLoop () {
  isRunning = false
}

export function registerComponent (component) {
  registeredComponents.push(component)

  if (!isRunning) {
    startLoop()
  }
}

export function unregisterComponent (component) {
  registeredComponents.splice(registeredComponents.indexOf(component), 1)
}

function loop () {
  if (isRunning) {
    setTimeout(loop, 1000 / 60)
  }

  const now = Date.now()

  registeredComponents.forEach(component => component.update(now))
}
