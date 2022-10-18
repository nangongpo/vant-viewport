function assertStorage(storage) {
  storage.setItem('@@', 1)
  storage.removeItem('@@')
}

export default class Storage {
  constructor(prefix, name = 'session') {
    const nameMap = {
      'session': 'sessionStorage',
      'local': 'localStorage'
    }
    this.prefix = prefix
    this.storage = window[nameMap[name]]
  }

  _getKey(key) {
    return `__${this.prefix}_${key || ''}`
  }

  set(key, data) {
    assertStorage(this.storage)
    this.storage.setItem(this._getKey(key), JSON.stringify(data))
  }

  get(key) {
    const value = this.storage.getItem(this._getKey(key))
    return value ? JSON.parse(value) : value
  }

  remove(key) {
    return this.storage.removeItem(this._getKey(key))
  }

  clear() {
    const { storage } = this
    const prefixKey = this._getKey()

    for (const key in storage) {
      if (key.indexOf(prefixKey) > -1) {
        storage.removeItem(key)
      }
    }
  }
}
