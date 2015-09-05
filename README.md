Specular
========

Specular is a library for building lightshows with [React](https://github.com/facebook/react).

It supports outputting to DMX512 (the standard protocol for controlling many light fixtures) and MIDI (using [specular-midi](https://github.com/madjam002/specular-midi)).

## Example

```javascript
import React from 'react'
import {Scene} from 'specular'
import Color from 'color'

import fixtures from './fixtures'

export default class StaticBlue extends React.Component {

  render() {
    return (
      <Scene>
        {fixtures.parcans.map(Fixture =>
          <Fixture colour={Color('blue')} dimmer={255} />
        )}
      </Scene>
    )
  }

}
```

## Getting started

Install specular from npm:

```sh
$ npm install specular --save
```

Using ECMAScript 6 is recommended with Specular. The quickest way to get started is to install [babel](https://babel.io) globally:

```sh
$ npm install babel -g
```

Then create `index.js` in the root of your project and run it with:

```sh
$ babel-node index.js
```

#### TODO starter repo

## Use in production

Specular has been used to control the lighting rig in several venues already. Here are some pictures!

#### TODO pictures!
