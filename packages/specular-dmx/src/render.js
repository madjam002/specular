import {Fixture} from './fixture'

let universeData

export default function (universeRenderers) {
  return {
    before() {
      universeData = {}
      Object.keys(universeRenderers).forEach(key => universeData[key] = {})
    },

    render(component) {
      if (component instanceof Fixture && component._channels != null && component._universe != null) {
        Object.assign(universeData[component._universe], component._channels)
      }
    },

    after() {
      Object.keys(universeRenderers).forEach(universe => {
        const renderers = universeRenderers[universe]

        if (Array.isArray(renderers)) {
          renderers.forEach(renderer => renderer(universeData[universe]))
        } else {
          renderers(universeData[universe])
        }
      })
    },
  }
}
