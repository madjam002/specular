export default function Circle(opts = {}) {
  opts.radius = opts.radius || 128
  opts.xOffset = opts.xOffset || 128
  opts.yOffset = opts.yOffset || 128

  return (progress) => {
    let angle = progress * 6.28318531
    return { x: opts.xOffset + Math.cos(angle) * opts.radius, y: opts.yOffset + Math.sin(angle) * opts.radius }
  }
}
