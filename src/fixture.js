import {Component} from './component'

export class Fixture extends Component {
  static type = 'fixture'

  render() {
    let channels = this.props.channels

    for (let index in channels) {
      if (channels[index] === undefined) continue

      let channelNumber = parseInt(index) + this.props.start
      this.context.result[channelNumber] = channels[index]
    }
  }
}
