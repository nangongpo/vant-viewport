import axios from 'axios'
import { nanoid } from 'nanoid'
import sha1 from 'sha1.js'
import { config } from '@/jssdk/script/wechat'
import sha256 from 'crypto-js/sha256'

const allConfig = {
  grant_type: 'client_credential',
  appid: config.app_id,
  secret: config.appsecret
}

// 微信签名服务地址
const signURL = ''

const access_token_key = 'access_token'

const tokenStorage = {
  get: () => {
    const access_token_str = localStorage.getItem(access_token_key)
    if (access_token_str) {
      const [access_token, expire] = access_token_str.split('|')
      if (new Date().getTime() < expire) {
        return access_token
      }
    }
  },
  set: (str, expires) => localStorage.setItem(access_token_key, `${str}|${expires}`),
  remove: () => localStorage.removeItem(access_token_key)
}

// /v1/api/User/SignWxJSAPI 接口签名方法
function getSignature(data) {
  const dataStr = JSON.stringify(data)
  return sha256(dataStr).toString()
}

function getToken() {
  return new Promise((resolve, reject) => {
    const access_token = tokenStorage.get()
    if (access_token) {
      return resolve(access_token)
    }
    axios({
      url: '/cgi-bin/token',
      method: 'get',
      params: allConfig
    }).then(res => {
      const { errmsg, access_token, expires_in } = res.data
      if (!errmsg) {
        const expires = new Date().getTime() + (expires_in * 1000)
        tokenStorage.set(access_token, expires)
        resolve(access_token)
      } else {
        reject(new Error(errmsg))
      }
    })
  })
}

function getTicket(access_token) {
  return new Promise((resolve, reject) => {
    axios({
      url: '/cgi-bin/ticket/getticket',
      method: 'get',
      params: {
        access_token,
        type: 'jsapi'
      }
    }).then(res => {
      const { errcode, errmsg, ticket } = res.data
      if (errcode === 0) {
        resolve(ticket)
      } else {
        reject(new Error(errmsg))
      }
    })
  })
}

export async function getWechatOptions(success, error) {
  const isDev = process.env.NODE_ENV === 'development'

  const { appid } = allConfig
  let wechatOptions
  const data = {
    Nonce: nanoid(16),
    Timestamp: Math.round(new Date().getTime() / 1000).toString(),
    AppID: appid,
    Url: document.location.href.split('#')[0]
  }

  try {
    if (isDev) {
      const access_token = await getToken()
      const jsapi_ticket = await getTicket(access_token)
      const signatureConfig = { jsapi_ticket, noncestr: data.Nonce, timestamp: data.Timestamp, url: data.Url }

      const signature = Object.keys(signatureConfig).reduce((t, v, i) => {
        return t + `${i > 0 ? '&' : ''}${v}=${signatureConfig[v]}`
      }, '')

      wechatOptions = {
        debug: isDev,
        appId: data.AppID,
        timestamp: data.Timestamp,
        nonceStr: data.Nonce,
        signature: sha1.hex(signature),
        jsApiList: config.jsApiList
      }
      success && success(wechatOptions)
      return
    }
    const res = await axios({
      url: signURL,
      method: 'post',
      data,
      headers: {
        'X-Sign': getSignature(data)
      }
    })
    const reponseData = res.data
    const { Data, OK } = reponseData
    if (OK) {
      wechatOptions = {
        debug: isDev,
        appId: data.AppID,
        timestamp: data.Timestamp,
        nonceStr: data.Nonce,
        signature: Data.Sign,
        jsApiList: config.jsApiList
      }
      success && success(wechatOptions)
    } else {
      error && error(new Error(`获取微信签名有问题，暂时无法使用本系统，请稍后使用（ ${reponseData.Error} ）`))
    }
  } catch (err) {
    tokenStorage.remove()
    error && error(new Error(`获取微信签名有问题，暂时无法使用本系统，请稍后使用（ ${err.message} ）`))
  }
}
