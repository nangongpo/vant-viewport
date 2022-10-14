import { getWechatOptions } from '@/api/wechat'
import { globalVarMap, getJsApi, getAppBrowser } from './util'

import settings from '@/settings'

const loadScript = require('load-script')
// 脚本名称
const scriptSrc = {
  wechat: 'weixin-1.6.0.js',
  alipay: 'alipay-3.1.1.js'
}

function getScriptSrc(scriptName) {
  return `${settings.publicPath}jssdk/${scriptSrc[scriptName]}`
}

// jssdk加载
function loadJssdk() {
  return new Promise((reslove, reject) => {
    const scriptName = getAppBrowser()
    const globalVar = globalVarMap[scriptName]
    const jsApi = getJsApi(scriptName)
    const loadedJS = () => window[globalVar]
    const formatApi = (api) => {
      return { ...api, ...jsApi }
    }
    if (loadedJS()) {
      return reslove(formatApi(loadedJS()))
    }
    const src = getScriptSrc(scriptName)
    const opts = { attrs: {}}
    loadScript(src, opts, (err) => {
      if (err) {
        return reject(err)
      }
      if (scriptName === 'wechat') {
        return getWechatOptions(
          (config) => {
            // config.jsApiList = null
            config.debug = false
            wx.config(config)
            wx.ready(() => {
              reslove(formatApi(wx))
            })
            wx.error((err) => {
              reject(new Error('微信jssdk-' + err.errMsg))
            })
          },
          (err) => {
            reject(err)
          }
        )
      }
      reslove(formatApi(loadedJS()))
    })
  })
}

// 调用jssdk
export function apiReady(apiName, config) {
  return new Promise((resolve, reject) => {
    loadJssdk().then(app => {
      if (!app.checkJsApi(apiName)) {
        reject(new Error(`${apiName}方法不存在`))
        return
      }
      resolve(app[apiName](config))
    }).catch(reject)
  })
}

