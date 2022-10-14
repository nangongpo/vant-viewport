import merge from 'deepmerge'
import * as shvl from 'shvl'

const defaultOptions = {
  key: 'vuex',
  paths: undefined,
  reducer: (state, paths) => {
    return Array.isArray(paths)
      ? paths.reduce(function(substate, path) {
        return shvl.set(substate, path, shvl.get(state, path))
      }, {})
      : state
  },
  subscriber: (store) => {
    return function(handler) {
      return store.subscribe(handler)
    }
  },
  storage: window && window.localStorage,
  getState: (key, storage) => {
    const value = storage.getItem(key)

    try {
      return (typeof value === 'string')
        ? JSON.parse(value) : (typeof value === 'object')
          ? value : undefined
    // eslint-disable-next-line no-empty
    } catch (err) {}

    return undefined
  },
  setState: (key, state, storage) => {
    return storage.setItem(key, JSON.stringify(state))
  },
  filter: () => {
    return true
  },
  arrayMerger: (state, saved) => saved, // deepmerge 数组合并方法
  rehydrated: (store) => {}, // 补充方法
  fetchBeforeUse: false,
  overwrite: false,
  assertStorage: (storage) => {
    storage.setItem('@@', 1)
    storage.removeItem('@@')
  }
}

export default function(options = {}) {
  const newOptions = { ...defaultOptions, ...options }
  const { key, paths, reducer, subscriber, storage, getState, setState, filter, arrayMerger, rehydrated, fetchBeforeUse, overwrite, assertStorage } = newOptions

  // 验证能否存储
  assertStorage(storage)

  // 获取保存的值
  const fetchSavedState = () => getState(key, storage)

  let savedState

  if (fetchBeforeUse) {
    savedState = fetchSavedState()
  }

  return function(store) {
    if (!fetchBeforeUse) {
      savedState = fetchSavedState()
    }

    if (typeof savedState === 'object' && savedState !== null) {
      store.replaceState(
        overwrite
          ? savedState
          : merge(store.state, savedState, {
            arrayMerge: arrayMerger,
            clone: false
          })
      )
      rehydrated(store)
    }

    subscriber(store)(function(mutation, state) {
      if (filter(mutation)) {
        setState(
          key,
          reducer(state, paths),
          storage
        )
      }
    })
  }
}
