import settings from '@/settings'

// 获取放在public目录下的文件
export function getLocalFile(path) {
  return `${settings.publicPath}${path}`
}
