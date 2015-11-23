import midi from 'midi'
import {events} from './events'

const _ports = {}

export const ports = {
  get(port) {
    if (!_ports[port]) {
      const inputPort = new midi.input() // eslint-disable-line new-cap
      const outputPort = new midi.output() // eslint-disable-line new-cap

      const portNum = parseInt(port, 10)

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
        } else if (type >= 176 && type < (176 + 16)) {
          const channel = message[0] - 176 + 1
          events.emit('note:control-change', {
            port: portNum,
            channel,
            control: message[1],
            value: message[2],
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
