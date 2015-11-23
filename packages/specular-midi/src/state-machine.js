import {createStateMachineConfig} from 'specular'
import {ports} from './ports'

export const noteStateMachine = createStateMachineConfig({

  initialState: {
    on: false,
    velocity: 0,
  },

  receiveState(nextState, oldState, { port, channel, note }) {
    if (nextState.on && !oldState.on) {
      // off -> on
      ports.get(port).output.sendMessage([
        144 + channel - 1, // 144+ is note on
        note,
        nextState.velocity,
      ])
    } else if (!nextState.on && oldState.on) {
      // on -> off
      ports.get(port).output.sendMessage([
        128 + channel - 1, // 128+ is note off
        note,
        nextState.velocity,
      ])
    } else if (nextState.on && oldState.on && nextState.velocity !== oldState.velocity) {
      // on -> on
      ports.get(port).output.sendMessage([
        144 + channel - 1, // 144+ is note on
        note,
        nextState.velocity,
      ])
    }
  },
})
