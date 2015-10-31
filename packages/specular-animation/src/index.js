// Hack so popmotion works on NodeJS (it expects window.performance to be around)
global.performance = null

export * from './animate'
export * from './beat-engine'
