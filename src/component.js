import _ from 'lodash'

export class Component {
  constructor(props) {
    this.props = props
    this.tweens = {}
  }

  render() {
  }

  unmount() {
    if (!this.isMounted) return
    if (this.componentWillUnmount) this.componentWillUnmount()

    // stop tweens
    let tweens = this.tweens ? this.tweens : {}
    for (let tween in tweens) {
      tweens[tween].dispose()
      delete tweens[tween]
    }

    this.isMounted = false
    console.log(this.constructor.name, 'has been unmounted')
  }
}
