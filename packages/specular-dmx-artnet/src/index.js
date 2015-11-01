import artnoot from 'artnoot'

export default function ArtNet (host) {
  const client = new artnoot.Client({
    host
  }).connect()

  client.set(0, 1, 0) // initial packet

  return function (universeData) {
    const data = new Array(512)

    for (let i = 1; i <= 512; i++) {
      data[i - 1] = Math.min(Math.round(universeData[i] || 0), 255)
    }

    client.data[0] = data
    client._send()
  }
}
