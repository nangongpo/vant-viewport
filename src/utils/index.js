/**
 * 是否是JSON字符串
 * @param {string} str
 * @returns {boolean}
 */
export function isJSON(str) {
  if (typeof str === 'string') {
    try {
      JSON.parse(str)
      return true
    } catch (e) {
      return false
    }
  }
}

/**
 * @param {array} actual
 * @returns {array}
 */
export function cleanArray(actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

/**
 * 对象转get请求参数
 * @param {object} obj
 * @returns {string}
 */
export function param(obj) {
  if (!obj) return ''
  return cleanArray(
    Object.keys(obj).map(key => {
      if (obj[key] === undefined) return ''
      return encodeURIComponent(key) + '=' + encodeURIComponent(obj[key])
    })
  ).join('&')
}

/**
 * get请求参数转对象
 * @param {string} url
 * @returns {object}
 */
export function param2Obj(url) {
  let search = url.split('?')[1]
  if (!search) {
    return {}
  }
  search = search.split('#')[0]
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
  )
}

/**
 * 深拷贝
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

/**
 * setTimeout倒计时, 时间间隔稳定，不会出现丢帧的现象
 * @param {functuon} cb
 * @param {num} second // 倒计时秒数 或 毫秒数(需要设置isMilliSecond = true), 后端返回10位的时间戳(其实就是秒数，直接传參就行)
 * @param {object} options { immediate： 立即执行cb,  isMilliSecond: 是毫秒 }
 */
export function countDown(cb, second = 0, options = {}) {
  const { immediate = true, isMilliSecond = false } = options
  let s = isMilliSecond ? Math.floor(second / 1000) : second
  if (immediate) {
    cb && cb(s)
  }
  let timer = setTimeout(() => {
    if (s > 0) {
      s--
      cb && cb(s)
      countDown(cb, s, { immediate: false, isMilliSecond: false })
      return
    }
    clearTimeout(timer)
    timer = null
  }, 1000)
}

// 连续点击
export class ContinuousClick {
  constructor(dom, opts = {}) {
    this.dom = dom
    this.total = opts.total || 5
    this.waitTime = opts.waitTime || 300 // 该时间间隔内点击才算连续点击（单位：ms）
    this.lastTime = null
    this.count = 0 // 连续点击次数
    this.timer = null
    this.cb = null
    this._click = () => {
      const { total, count, waitTime, lastTime, timer, cb } = this
      if (!this.lastTime) {
        this.count = 1
        this.lastTime = new Date().getTime()
      } else {
        const currentTime = new Date().getTime()
        // 计算两次相连的点击时间间隔
        this.count = (currentTime - lastTime) < waitTime ? count + 1 : 1
        this.lastTime = new Date().getTime()
        clearTimeout(timer)
        this.timer = setTimeout(() => {
          clearTimeout(this.timer)
          if (this.count > total - 1) {
            // console.log(`连续点击${total}次了`)
            cb && cb()
          }
        }, waitTime + 10)
      }
    }
  }

  on(cb) {
    this.cb = cb
    this.dom && this.dom.addEventListener('click', this._click)
  }

  off() {
    this.dom && this.dom.removeEventListener('click', this._click)
  }
}
