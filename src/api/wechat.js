import axios from 'axios'
import { nanoid } from 'nanoid'
import sha1 from 'sha1.js'
import { Dialog } from 'vant'
import { config } from '@/jssdk/script/wechat'

const allConfig = {
  grant_type: 'client_credential',
  appid: config.app_id,
  secret: config.appsecret
}

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
  const url = document.location.href.split('#')[0]
  const { appid } = allConfig
  const noncestr = nanoid(16)
  const timestamp = Math.round(new Date().getTime() / 1000).toString()
  let wechatOptions

  try {
    if (isDev) {
      const access_token = await getToken()
      const jsapi_ticket = await getTicket(access_token)
      const signatureConfig = { jsapi_ticket, noncestr, timestamp, url }

      const signature = Object.keys(signatureConfig).reduce((t, v, i) => {
        return t + `${i > 0 ? '&' : ''}${v}=${signatureConfig[v]}`
      }, '')

      wechatOptions = {
        debug: isDev,
        appId: appid,
        timestamp,
        nonceStr: noncestr,
        signature: sha1.hex(signature),
        jsApiList: config.jsApiList
      }
    } else {
      const getSign = async() => {
        const data = {
          Nonce: noncestr,
          Timestamp: timestamp(),
          AppID: appid,
          Url: url
        }
        const res = await axios({
          url: 'https://wxapp.jtgzfw.com/trafficbusiness/v1/api/User/SignWxJSAPI',
          method: 'post',
          data
        })
        const reponseData = res.data
        const { Data, OK, Error } = reponseData
        if (OK) {
          wechatOptions = {
            debug: isDev,
            appId: appid,
            timestamp: data.Timestamp,
            nonceStr: data.Nonce,
            signature: Data.Sign,
            jsApiList: config.jsApiList
          }
          setTimeout(() => {
            getSign()
          }, Data.Expire * 1000)
        } else {
          Dialog({ message: `获取微信签名有问题，暂时无法使用本系统，请稍后使用（ ${Error} ）` })
        }
      }
      getSign()
    }
    success && success(wechatOptions)
  } catch (err) {
    tokenStorage.remove()
    error && error(new Error(`获取微信签名有问题，暂时无法使用本系统，请稍后使用（ ${err.message} ）`))
  }
}
