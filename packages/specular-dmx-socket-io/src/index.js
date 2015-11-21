import http from 'http'
import socketio from 'socket.io'

const servers = []

export function createSocketServer(port) {
  const server = http.Server()
  const io = socketio(server)

  server.listen(port)

  return {
    universeRenderer(universe) {
      return function (data) {
        io.emit('universe', { universe, data })
      }
    }
  }
}
