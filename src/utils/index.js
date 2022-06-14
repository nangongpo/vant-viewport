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
