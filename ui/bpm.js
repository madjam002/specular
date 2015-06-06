import React from 'react'
import Radium from 'radium'
import ipc from 'ipc'

import {View} from './view'
import {Text} from './text'
import {Well} from './well'
import {Button} from './button'
import {Row} from './grid'

class BPM extends React.Component {
  constructor(props) {
    super(props)

    this.state = { bpm: 130, beat: 0 }
  }

  componentDidMount() {
    console.log('mounted')
    this.onBeat = this.onBeat.bind(this)
    ipc.on('beat', this.onBeat)
  }

  componentWillUnmount() {
    ipc.removeListener('beat', this.onBeat)
  }

  onBeat(msg) {
    this.setState({ beat: msg.beat % 4, bpm: 60000 / msg.ms, totalBeats: msg.beat })
  }

  render() {
    return (
      <Well style={this.props.style}>
        <Text style={styles.bpm}>{this.state.bpm.toFixed(2)} bpm</Text>
        <View style={styles.indicators}>
          <View style={[styles.indicator, this.state.beat === 0 && styles.indicatorActive]} />
          <View style={[styles.indicator, this.state.beat === 1 && styles.indicatorActive]} />
          <View style={[styles.indicator, this.state.beat === 2 && styles.indicatorActive]} />
          <View style={[styles.indicator, this.state.beat === 3 && styles.indicatorActive]} />
        </View>
        <Row>
          <Button shortcut="ctrl" press={() => ipc.send('beat:tap')}>Beat</Button>
          <Button press={() => ipc.send('beat:reset')}>Reset Beat</Button>
        </Row>
      </Well>
    )
  }
}

BPM = Radium.Enhancer(BPM)

const styles = {
  bpm: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
  indicators: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '0 20px',
    marginTop: 10,
    marginBottom: 10,
  },
  indicator: {
    width: 30,
    height: 7,
    backgroundColor: 'white',
    opacity: 0.3,
    transition: '100ms opacity',
  },
  indicatorActive: {
    opacity: 1,
  },
  buttons: {
    padding: '0 20px',
  },
}

export {BPM}
