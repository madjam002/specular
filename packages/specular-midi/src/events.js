import {EventEmitter} from 'events'

const events = new EventEmitter()
events.setMaxListeners(9999)

export {events}
