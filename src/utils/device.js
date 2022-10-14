/* eslint-disable no-cond-assign */

// 声明一些常见app内置浏览器的判断
export function getAppBrowserName() {
  const { userAgent } = window.navigator
  let appBrowser
  if (/AlipayClient/.test(userAgent)) {
    appBrowser = 'alipay'
  } else if (/MicroMessenger/.test(userAgent)) {
    appBrowser = 'wechat'
  } else if (/izzzwfwapp/.test(userAgent)) {
    appBrowser = 'izzmatch'
  } else if (/QQBrowser/.test(userAgent)) {
    appBrowser = 'qq'
  } else if (/UCBrowser/.test(userAgent)) {
    appBrowser = 'uc'
  }
  return appBrowser
}

// 获取设备类型
export function getDeviceType() {
  const { userAgent } = window.navigator
  let type
  // 系统类型
  if (/(iPhone|iPad|iPod|iOS)/i.test(userAgent)) {
    type = 'ios'
  } else if (/(Android)/i.test(userAgent)) {
    type = 'android'
  } else {
    type = 'pc'
  }
  return type
}

// 获取主流浏览器的名称及其版本号
export function getBrowserNameVersion() {
  const { top, self, devicePixelRatio, navigator } = window
  // 判断页面是否被iframe嵌套
  const inIFrame = top !== self
  const { userAgent, cookieEnabled } = navigator
  const Sys = {}
  const ua = userAgent.toLowerCase()
  let s
  (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1]
    : (s = ua.match(/msie ([\d\.]+)/)) ? Sys.ie = s[1]
      : (s = ua.match(/edge\/([\d\.]+)/)) ? Sys.edge = s[1]
        : (s = ua.match(/firefox\/([\d\.]+)/)) ? Sys.firefox = s[1]
          : (s = ua.match(/(?:opera|opr).([\d\.]+)/)) ? Sys.opera = s[1]
            : (s = ua.match(/chrome\/([\d\.]+)/)) ? Sys.chrome = s[1]
              : (s = ua.match(/version\/([\d\.]+).*safari/)) ? Sys.safari = s[1] : 0
  let browser = 'unknown'
  let browserVersion = 'unknown'

  for (const key in Sys) {
    browser = key
    browserVersion = Sys[key]
  }
  return { inIFrame, cookieEnabled, devicePixelRatio, browser, browserVersion }
}
