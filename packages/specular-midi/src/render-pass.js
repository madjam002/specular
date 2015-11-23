import {Note, _stateMachines as noteStateMachines} from './note'

export default {

  before() {},

  render(component) {
    if (component instanceof Note) {
      component.render()
    }
  },

  after() {
    noteStateMachines.flushAll()
  },

}
