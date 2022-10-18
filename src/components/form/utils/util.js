/**
 * 检验数据类型
 * @param {any} data
 * @param {string} type
 * @returns {string|boolean}
 */
export function checkType(data, type) {
  const _type = Object.prototype.toString.call(data).slice(1, -1).split(' ')[1].toLowerCase()
  if (type) {
    return _type === type.toLowerCase()
  }
  return _type
}
