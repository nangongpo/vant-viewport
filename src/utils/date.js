import dayjs from 'dayjs'
// import duration from 'dayjs/plugin/duration'
// dayjs.extend(duration)

// 格式化
export function dateFormat(dateStr, format = 'YYYY/MM/DD HH:mm') {
  return dateStr ? dayjs(dateStr).format(format) : dateStr
}

export function dateDiff(date1, date2) {
  const x = dayjs(date1)
  const y = dayjs(date2)
  return Math.abs(x.diff(y))
}

export default dayjs
