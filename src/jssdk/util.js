// 桥接微信和支付宝
import Vue from 'vue'
import { getAppBrowserName } from '@/utils/device'
import { getAlipayCode, alipayApi } from './script/alipay'
import { getWechatCode, wechatApi } from './script/wechat'
import { customAlphabet } from 'nanoid'

// 随机字符串
export const noncestr = (seed, number = 12) => customAlphabet(`1234567890${seed}jssdk`, 12)(number)

// 生产环境
export const isProd = process.env.NODE_ENV === 'production'

// 全局变量映射关系
export const globalVarMap = {
  'alipay': 'ap',
  'wechat': 'wx'
}

/**
 * 使用挂载到Vue原型上的弹窗方法
 * @param {string|object} opts
 * @returns
 */
const defaultAlertInfo = {
  title: '消息提示',
  width: '320px',
  message: '未知异常',
  theme: 'round'
}

export function showAlert(opts = defaultAlertInfo) {
  if (typeof (opts) === 'string') {
    opts = {
      ...defaultAlertInfo,
      message: `程序异常：${opts}`
    }
  }
  return Vue.prototype.$dialog.alert(opts)
}

// 获取浏览器名称
export function getAppBrowser() {
  return getAppBrowserName()
}

// 获取code
export function getCode(opts) {
  const appBrowser = getAppBrowser()
  switch (appBrowser) {
    case 'wechat':
      getWechatCode(opts)
      break
    case 'alipay':
      getAlipayCode(opts)
      break
  }
}

/**
 * 验证code是否有效, 判断state是否有效, code不能重复加载
 * @param {obje} queryObj 链接解析成的对象
 */
export function checkCode(queryObj = {}, cacheObj) {
  return new Promise((resolve, reject) => {
    const appBrowser = getAppBrowser()
    const state = localStorage.getItem('state')
    const oldCode = cacheObj?.code
    let newCode
    let valid = false
    switch (appBrowser) {
      case 'wechat':
        newCode = queryObj.code
        valid = newCode && newCode !== oldCode
        break
      case 'alipay':
        newCode = queryObj.auth_code
        valid = newCode && newCode !== oldCode
        break
    }
    valid = !!valid && state === queryObj.state
    if (valid) {
      resolve({ valid, code: newCode, message: '' })
      return
    }
    resolve({ valid, code: newCode, message: '静默登录失败' })
  })
}

// 分发api
export function getJsApi(appBrowser) {
  let api
  switch (appBrowser) {
    case 'wechat':
      api = wechatApi
      break
    case 'alipay':
      api = alipayApi
      break
  }
  return api
}

