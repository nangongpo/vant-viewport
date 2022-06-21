import { globalVarMap, getJsApi } from './util'

import { getWechatOptions } from '@/api/wechat'
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

// jssdk加载器
export default class initJssdk {
  constructor(scriptName, config = {}) {
    this.scriptName = scriptName
    this.filename = (scriptName + '.js').toString()
    this.config = config
    this.jsApi = getJsApi(scriptName)
    this._globalVar = globalVarMap[scriptName]
    this._window = window
  }

  loadedJS() {
    return this._window[this._globalVar]
  }

  formatApi(api = {}) {
    return { ...api, ...this.jsApi }
  }

  load() {
    return new Promise((reslove, reject) => {
      const src = getScriptSrc(this.scriptName)
      const opts = { attrs: { id: this.scriptName }}
      loadScript(src, opts, (err) => {
        if (err) {
          return reject(err)
        }
        if (this.scriptName === 'wechat') {
          return getWechatOptions(
            (config) => {
              // config.jsApiList = null
              config.debug = false
              wx.config(config)
              wx.ready(() => {
                reslove(this.formatApi(wx))
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
        reslove(this.formatApi(this.loadedJS()))
      })
    })
  }
}
