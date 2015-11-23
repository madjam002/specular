specular-dmx
========

> Control lighting fixtures and build light shows with React and Specular.

## Installation

```sh
$ npm install specular-dmx
```

## Example usage

`index.js`:

```javascript
import React from 'react'
import Specular, {Scene} from 'specular'
import SpecularDMX from 'specular-dmx'
import ArtNet from 'specular-dmx-artnet'

import StaticBlue from './static-blue'

const renderTargets = [
  SpecularDMX({
    /* Config for SpecularDMX, sets DMX universe 0 to output to Artnet */
    0: ArtNet('127.0.0.1')
  })
]

Specular.render(
  <Scene>
    <StaticBlue />
  </Scene>
, renderTargets)
```

`static-blue.js`:

```javascript
import React from 'react'
import {Scene} from 'specular'
import Color from 'color'

import parcans from './parcans'

export default class StaticBlue extends React.Component {

  render() {
    return (
      <Scene>
        {parcans.map(Parcan =>
          <Parcan colour={Color('blue')} dimmer={255} />
        )}
      </Scene>
    )
  }

}
```
