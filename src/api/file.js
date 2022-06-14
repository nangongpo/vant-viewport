import settings from '@/settings'
// 获取放在public目录下的文件
export function getLocalFile(path) {
  const domain = window.location.origin
  return process.env.NODE_ENV === 'production' ? `${domain}/${settings.name}/static${path}` : `${domain}${path}`
}
