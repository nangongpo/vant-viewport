import { isProd, noncestr, createQueryString } from '../util'

// 支付宝 网页与移动应用： https://open.alipay.com/platform/appManage.htm#/app/2021003130656600/overview
const devConfig = {
  url: 'https://openauth.alipaydev.com/oauth2/publicAppAuthorize.htm',
  app_id: '2021003130656600',
  scope: 'auth_base' // 静默登录：auth_base 非静默：auth_user
}

// 支付宝生活号
const prodConfig = {
  url: 'https://openauth.alipay.com/oauth2/publicAppAuthorize.htm',
  app_id: '',
  scope: 'auth_base'
}

const config = isProd ? prodConfig : devConfig

export function getAlipayCode(opts = {}) {
  const { appid = config.app_id, redirect_uri = window.location.href } = opts
  const [uri, queryStr] = redirect_uri.split('#')
  const query = queryStr.split('?')[1]
  const redirect_url = query ? uri + '?' + query : uri
  const params = {
    app_id: appid,
    redirect_uri: redirect_url,
    scope: config.scope,
    state: noncestr('alipay') // 商户自定义参数，用户授权后，重定向到 redirect_uri 时会原样回传给商户。 为防止 CSRF 攻击，建议开发者请求授权时传入 state 参数，该参数要做到既不可预测，又可以证明客户端和当前第三方网站的登录认证状态存在关联，并且不能有中文
  }
  // 保存state
  localStorage.setItem('state', params.state)
  // https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=商户的APPID&scope=auth_user&redirect_uri=ENCODED_URL&state=init
  window.location.href = `${config.url}?${createQueryString(params)}`
}

// 重写jssdk, 方法名称以微信为准, 入參基本与微信一致
export const alipayApi = {
  // 判断当前客户端版本是否支持指定 JS 接口
  checkJsApi(apiList) {
    const allApi = Object.keys(alipayApi)
    const checkApi = (api) => allApi.includes(api)
    return Array.isArray(apiList) ? apiList.some(api => checkApi(api)) : checkApi(apiList)
  },
  // 使用支付宝内置地图查看位置
  openLocation(opts = {}) {
    const { longitude = 0, latitude = 0, name = '支付宝', address, scale = 15 } = opts
    return new Promise((resolve, reject) => {
      ap.openLocation({
        longitude,
        latitude,
        name,
        address,
        scale // 缩放比例，范围3~19，默认为15
      }).then(() => {
        resolve()
      }).catch(err => {
        reject(new Error(err.errorMessage))
      })
    })
  },
  // 地理位置 type 0: 返回所有 1：逆地理编码到城市；2：仅获取经纬度、速度和精度。默认为 2, 返回gcj02坐标系的坐标
  getLocation(type = 0) {
    return new Promise((resolve, reject) => {
      ap.getLocation({ type }).then(res => {
        const { address, pois = [] } = res
        const { name } = pois[0] || {}
        const newResult = {
          openLocation: {
            name: name || address,
            address
          },
          ...res
        }
        resolve(newResult)
      }).catch(err => {
        console.log(err)
        reject(new Error(err.errorMessage || err.message))
      })
    })
  },
  // 扫一扫 type = qrCode | barCode, 默认qrCode
  scanQRCode(type = 'qrCode') {
    const typeMap = {
      qrCode: 'qr',
      barCode: 'bar'
    }
    return new Promise((resolve, reject) => {
      ap.scan({ type: typeMap[type] }).then(res => {
        resolve(res.code)
      }).catch(err => {
        reject(new Error(err.errorMessage || err.message))
      })
    })
  },
  // 关闭当前页面
  closeWindow() {
    ap.popWindow()
  }
}
