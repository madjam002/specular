import {Note} from './note'
import {ports} from './ports'
import {events} from './events'
import _ from 'lodash'

let newChannels = {}
let oldChannels = {}

export default {

  before() {
    newChannels = {}
  },

  render(component) {
    if (component instanceof Note && component.isOn()) {
      if (!newChannels[component._port]) newChannels[component._port] = {}
      if (!newChannels[component._port][component._channel]) newChannels[component._port][component._channel] = {}
      newChannels[component._port][component._channel][component._note] = component._velocity
    }
  },

  after() {
    // New notes (note on messages)
    for (const port in newChannels) {
      const { output } = ports.get(port)

      for (const channel in newChannels[port]) {
        for (const note in newChannels[port][channel]) {
          // output note on if this port, channel, or note wasn't on previously
          if (
            (!oldChannels[port] || !oldChannels[port][channel] || oldChannels[port][channel][note] === undefined) ||
            (oldChannels[port][channel][note] !== newChannels[port][channel][note])
          ) {
            let defaultPrevented = false
            const eventPayload = {
              port: parseInt(port),
              channel: parseInt(channel),
              note: parseInt(note),
              velocity: newChannels[port][channel][note],
              preventDefault() { defaultPrevented = true },
            }

            events.emit(`${port}:${channel}:${note}:out:noteOn`, eventPayload)
            events.emit(`${port}:${channel}:out:noteOn`, eventPayload)
            events.emit(`${port}:out:noteOn`, eventPayload)

            if (!defaultPrevented) {
              output.sendMessage([
                144 + parseInt(channel) - 1,
                parseInt(note),
                newChannels[port][channel][note],
              ])
            }
          }
        }
      }
    }

    // Old notes (note off messages)
    // loop through oldChannels because all new channels will be covered by note on messages above
    for (const port in oldChannels) {
      // same with channel...
      for (const channel in oldChannels[port]) {
        // diff...
        if (newChannels[port] && newChannels[port][channel]) {
          const oldNotes = _.difference(Object.keys(oldChannels[port][channel]), Object.keys(newChannels[port][channel]))
          for (const oldNote of oldNotes) {
            const { output } = ports.get(port)
            let defaultPrevented = false
            const eventPayload = {
              port: parseInt(port),
              channel: parseInt(channel),
              note: parseInt(oldNote),
              velocity: 0,
              preventDefault() { defaultPrevented = true },
            }

            events.emit(`${port}:${channel}:${oldNote}:out:noteOff`, eventPayload)
            events.emit(`${port}:${channel}:out:noteOff`, eventPayload)
            events.emit(`${port}:out:noteOff`, eventPayload)

            if (!defaultPrevented) {
              output.sendMessage([
                128 + parseInt(channel) - 1,
                parseInt(oldNote),
                0,
              ])
            }
          }
        }
      }
    }

    // store old channels
    oldChannels = newChannels
  },

}
