import artnet from 'artnet'

export default function ArtNet(host) {
  const conn = artnet({
    host,
  })

  return function (universeData) {
    const data = new Array(512)

    for (const k in universeData) {
      data[k] = universeData[k]
    }

    conn.set(data)
  }
}
