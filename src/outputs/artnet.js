import artnet from 'artnet'

export function ArtNet(universe, host) {
  artnet.connect(host)

  return function (app) {
    app.on('output', universes => artnet.set(universes[universe]))
  }
}
