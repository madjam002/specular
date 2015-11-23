import midi from 'midi'
import {events} from './events'

const _ports = {}

export const ports = {
  get(port) {
    if (!_ports[port]) {
      const inputPort = new midi.input()
      const outputPort = new midi.output()

      const portNum = parseInt(port)

      inputPort.openPort(portNum)
      outputPort.openPort(portNum)

      inputPort.on('message', (__, message) => {
        const type = message[0]
        if (type >= 128 && type < (128 + 16)) {
          const channel = message[0] - 128 + 1
          events.emit('note:off', {
            port: portNum,
            channel,
            note: message[1],
            message,
          })
        } else if (type >= 144 && type < (144 + 16)) {
          const channel = message[0] - 144 + 1
          events.emit('note:on', {
            port: portNum,
            channel,
            note: message[1],
            message,
          })
        }
      })

      _ports[port] = {
        input: inputPort,
        output: outputPort,
      }
    }

    return _ports[port]
  },
}
