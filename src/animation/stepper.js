export default function Stepper(func, steps) {
  return (progress, from, to, time, totalTime) => {
    progress *= steps
    progress = Math.floor(progress) / steps
    return func(progress, from, to, time)
  }
}
