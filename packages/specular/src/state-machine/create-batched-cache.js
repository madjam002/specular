import {BatchedStateMachine} from './batched'

export function createBatchedStateMachineCache(stateMachineConfig) {
  const cache = {}

  return {
    get(cacheKey, initialConfig) {
      if (cache[cacheKey]) {
        return cache[cacheKey]
      }

      const stateMachine = new BatchedStateMachine(stateMachineConfig, initialConfig)
      cache[cacheKey] = stateMachine

      return stateMachine
    },
  }
}
