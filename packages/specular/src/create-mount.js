let nextMountId = 1

export function createMount() {
  return { __id: nextMountId++ }
}
