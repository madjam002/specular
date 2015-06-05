import _ from 'lodash'

export class Component {
  constructor(props) {
    this.props = props
    this.tweens = {}
  }

  render() {
  }

  unmount() {
    if (!this._mounted) return
    if (this.componentWillUnmount) this.componentWillUnmount()

    // stop tweens
    let tweens = this.tweens ? this.tweens : {}
    for (let tween in tweens) {
      tweens[tween].stop()
      delete tweens[tween]
    }

    this._mounted = false
    console.log(this.constructor.name, 'has been unmounted')
  }
}
