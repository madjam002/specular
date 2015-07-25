import http from 'http'
import socketio from 'socket.io'

import {Beat} from './beat'

export function SocketIO(port) {
  return function (app) {
    const server = http.Server()
    const io = socketio(server)

    Beat.on('beat', (msg) => io.emit('beat', msg))

    io.on('connection', socket => {
      console.log('Got socket connection')

      socket.on('beat:tap', () => Beat.beat())
      socket.on('beat:reset', () => Beat.reset())
      socket.on('rootProps:set', props => {
        app.setRootProps(props)
        io.emit('rootProps:update', app.getRootProps())
      })
      socket.on('rootProps:get', () => {
        io.emit('rootProps:update', app.getRootProps())
      })
    })

    server.listen(port)
  }
}
