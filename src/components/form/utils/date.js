import dayjs from 'dayjs'

// 格式化
export function dateFormat(dateStr, format = 'YYYY/MM/DD HH:mm') {
  if (!dateStr) return
  return dayjs(dateStr).format(format)
}

// 转Date
export function toDate(value) {
  if (!value) return
  return dayjs(value).toDate()
}

export default dayjs
