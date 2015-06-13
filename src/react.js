import {Fixture} from './fixture'
import {Scene} from './scene'
import _ from 'lodash'

let renderTree = {}
let newRenderTree = {}
let nextMountId = 1
let parentNextMountId = null
let currentId = ''

class ReactElement {
  static create(type, config, ...children) {
    let props = {}

    let key = null
    let ref = null

    if (config != null) {
      ref = config.ref === undefined ? null : config.ref
      key = config.key === undefined ? null : '' + config.key

      // add remaining props
      for (let propName in config) {
        if (config.hasOwnProperty(propName)) props[propName] = config[propName]
      }
    }

    // Children can be more than one argument, and those are transferred onto
    // the newly allocated props object.
    let childrenLength = arguments.length - 2
    if (childrenLength === 1) {
      props.children = children
    } else if (childrenLength > 1) {
      var childArray = Array(childrenLength)
      for (var i = 0; i < childrenLength; i++) {
        childArray[i] = arguments[i + 2]
      }
      props.children = childArray
    }

    // Resolve default props
    if (type && type.defaultProps) {
      let defaultProps = type.defaultProps
      for (let propName in defaultProps) {
        if (typeof props[propName] === 'undefined') {
          props[propName] = defaultProps[propName]
        }
      }
    }

    return new ReactElement(
      type,
      key,
      ref,
      null,
      props
    )
  }

  constructor(type, key, ref, owner, props) {
    // Built-in properties that belong on the element
    this.type = type
    this.key = key
    this.ref = ref

    // Record the component responsible for creating this element.
    this._owner = owner

    this.props = props
  }
}

export var React = {
  createElement: ReactElement.create,

  render(element, context) {
    nextMountId = 1
    currentId = ''
    newRenderTree = {}

    React._render(null, element, context)

    // look at new render tree and unmount old components
    let oldIds = _.difference(_.keys(renderTree), _.keys(newRenderTree))

    // unmount old ids
    for (let oldId of oldIds) {
      let component = renderTree[oldId]
      component.unmount()

      delete renderTree[oldId]
    }
  },

  _render(parentComponent, element, context) {
    if (!element) {
      throw new Error('No element provided!')
    }

    let key = ''

    if (element.key) key = `$${element.key}`

    let thisId = `${currentId}.${element.type.name}${key}$${nextMountId++}`

    let component = null

    if (renderTree[thisId] && element.type !== renderTree[thisId].constructor) {
      // ID already exists in render tree, but the component class is wrong
      renderTree[thisId].unmount()
      delete renderTree[thisId]
    }

    if (renderTree[thisId]) {
      component = newRenderTree[thisId] = renderTree[thisId]

      // props changed?
      if (!_.isEqual(component.props, element.props)) {
        if (component.componentWillReceiveProps) component.componentWillReceiveProps(element.props)
        component.props = _.clone(element.props)
      }
    } else {
      component = newRenderTree[thisId] = renderTree[thisId] = new element.type(_.clone(element.props), context)
      if (component.componentWillMount) component.componentWillMount()
      component._mounted = true
      // console.log('Mounted', thisId)
      if (component.componentDidMount) component.componentDidMount()
    }

    component._currentElement = element
    component.context = context

    parentNextMountId = nextMountId
    nextMountId = 1

    let oldCurrentId = currentId
    currentId = thisId

    if (component.constructor === Scene) { // scene is the root level component so it can have multiple children
      React._renderArray(component, component.props.children, context)
    } else {
      let renderResult = component.render()
      if (renderResult)
        React._render(component, component.render(), context)
    }

    currentId = oldCurrentId
    nextMountId = parentNextMountId
  },

  _renderArray(component, array, context) {
    let ind = 0
    for (let child of array) {
      if (!child) continue
      ind++

      if (child instanceof Array) {
        let oldCurrentId = currentId
        let oldMountId = nextMountId
        nextMountId = 1
        currentId = `${currentId}$${ind}`

        React._renderArray(component, child, context)

        currentId = oldCurrentId
        nextMountId = oldMountId
      } else {

        let oldCurrentId = currentId
        let oldMountId = nextMountId
        nextMountId = 1
        currentId = `${currentId}$${ind}`

        React._render(component, child, context)

        currentId = oldCurrentId
        nextMountId = oldMountId
      }
    }
  },

  getTreeState() {
    let state = {}

    for (let id in renderTree) {
      state[id] = {
        element: renderTree[id]._currentElement,
      }
    }

    return state
  },

  unmountAll(state) {
    for (let oldId in renderTree) {
      let component = renderTree[oldId]
      component.unmount()

      delete renderTree[oldId]
    }
  }
}
