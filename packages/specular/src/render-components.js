function renderComponent(component, passes) {
  if (component._renderedComponent) {
    renderComponent(component._renderedComponent, passes)
    return
  }

  // call render callbacks
  passes.forEach(pass => pass.render && pass.render.call(this, component))

  // process children
  if (component._renderedChildren) {
    const children = component._renderedChildren
    for (const key in children) {
      renderComponent(children[key], passes)
    }
  }
}

export function renderComponents(root, passes) {
  passes.forEach(pass => pass.before && pass.before.call(this))

  renderComponent(root._reactInternalInstance, passes)

  passes.forEach(pass => pass.after && pass.after.call(this))
}
