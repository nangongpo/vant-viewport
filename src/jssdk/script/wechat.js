/* eslint-disable no-unused-vars */
import axios from 'axios'
import { isProd, noncestr, createQueryString } from '../util'

// JS 接口列表: https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html
const jsApiList = ['closeWindow', 'scanQRCode', 'getLocation', 'openLocation']

// 测试公众号配置： https://mp.weixin.qq.com/debug/cgi-bin/sandboxinfo?action=showinfo&t=sandbox/index
const devConfig = {
  url: 'https://open.weixin.qq.com/connect/oauth2/authorize',
  app_id: 'wxcef58575848cd676',
  appsecret: '63976092d58292028dff9f67a2133fc1',
  scope: 'snsapi_base', // 静默登录：snsapi_base 非静默：snsapi_userinfo
  jsApiList,
  tecentMapKey: 'OUBBZ-NY2CF-JPVJZ-JJEQV-6QQNZ-XHB2W', // 开发密匙，个人逆地址解析 调用量10000， 企业开发者最高可申请300万免费配额
  tecentWebService: '' // WebService API 请求地址
}

// 公众号
const prodConfig = {
  url: 'https://open.weixin.qq.com/connect/oauth2/authorize',
  app_id: '',
  scope: 'snsapi_base',
  jsApiList,
  tecentMapKey: '',
  tecentWebService: 'https://apis.map.qq.com'
}

export const config = isProd ? prodConfig : devConfig

// 获取微信code
export function getWechatCode(opts = {}) {
  const { appid = config.app_id, redirect_uri = window.location.href } = opts
  const [uri, queryStr] = redirect_uri.split('#')
  const query = queryStr.split('?')[1]
  const redirect_url = query ? uri + '?' + query : uri
  const params = {
    appid: appid,
    redirect_uri: encodeURIComponent(redirect_url),
    response_type: 'code',
    scope: config.scope,
    state: noncestr('weixin')
  }
  // 保存state
  localStorage.setItem('state', params.state)
  // https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx520c15f417810387&redirect_uri=https%3A%2F%2Fchong.qq.com%2Fphp%2Findex.php%3Fd%3D%26c%3DwxAdapter%26m%3DmobileDeal%26showwxpaytitle%3D1%26vb2ctag%3D4_2030_5_1194_60&response_type=code&scope=snsapi_base&state=123#wechat_redirect
  window.location.href = `${config.url}?${createQueryString(params)}#wechat_redirect`
}

// 微信jssdk文档：https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html
export const wechatApi = {
  checkJsApi(apiList) {
    const allApi = Object.keys(wechatApi)
    const checkApi = (api) => allApi.includes(api)
    return Array.isArray(apiList) ? apiList.some(api => checkApi(api)) : checkApi(apiList)
  },
  // 扫一扫 type = qrCode | barCode, 默认qrCode
  scanQRCode(type = 'qrCode') {
    return new Promise((resolve, reject) => {
      wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理
        scanType: [type],
        success: (res) => {
          resolve(res.resultStr)
        },
        fail: (err) => {
          reject(new Error(err.errMsg))
        }
      })
    })
  },
  // 使用微信内置地图查看位置接口
  openLocation(opts = {}) {
    return new Promise((resolve, reject) => {
      const { longitude = 0, latitude = 0, name = '微信', address, scale = 15 } = opts
      wx.openLocation({
        latitude, // 纬度，浮点数，范围为90 ~ -90
        longitude, // 经度，浮点数，范围为180 ~ -180。
        name, // 位置名
        address, // 地址详情说明
        scale // 地图缩放级别,整型值,范围从1~28。默认为最大
      })
      resolve()
    })
  },
  // 获取地理位置接口, type 0: 返回所有 1：逆地理编码到城市；2：仅获取经纬度、速度和精度。默认为 2, 返回gcj02坐标系的坐标
  getLocation(type = 1) {
    const noRequest = type === 2
    return new Promise((resolve, reject) => {
      wx.getLocation({
        type: 'gcj02', // 默认为wgs84的 gps 坐标，如果要返回直接给 openLocation 用的火星坐标，可传入'gcj02'
        success: (res) => {
          // var latitude = res.latitude // 纬度，浮点数，范围为90 ~ -90
          // var longitude = res.longitude // 经度，浮点数，范围为180 ~ -180
          const { latitude, longitude } = res
          if (noRequest) {
            return resolve(res)
          }
          if (!config.tecentMapKey) {
            return reject(new Error('逆地理编码失败: 请配置腾讯地图开发密匙'))
          }
          // 逆地理编码到城市, 接口文档： https://lbs.qq.com/service/webService/webServiceGuide/webServiceGcoder
          axios.get(config.tecentWebService + '/ws/geocoder/v1/', {
            params: {
              location: [latitude, longitude].join(','),
              get_poi: type === 0 ? 1 : 0, // 是否返回周边地点（POI）列表， 0 不返回 1 返回
              key: config.tecentMapKey // 开发密钥（Key）
            }
          }).then((res) => {
            const { status, message, result } = res.data
            if (status !== 0) {
              reject(new Error(`逆地理编码失败: ${message}`))
            }
            const { address_component = {}, formatted_addresses = {}, ad_info = {}, pois } = result
            const { nation, province, city = '', district = '', street_number = '', street = '' } = address_component
            const name = formatted_addresses.recommend || ''
            const { nation_code, adcode, city_code } = ad_info
            const address = `${province}${city}${district}${street_number || street}${name}`
            // 返回结构参考： https://myjsapi.alipay.com/alipayjsapi/location/get/getLocation.html
            const newResult = {
              openLocation: {
                name,
                address
              },
              latitude, // 经度
              longitude, // 纬度
              country: nation, // 国家名
              countryCode: nation_code, // 国家编号
              province, // 省份名
              city, // 城市名
              cityCode: city_code, // 城市编码, 与支付宝的编码规则不一致, 慎用
              adCode: adcode, // 区域编码
              streetNumber: { street, number: street_number }, // 街道门牌信息，结构是：{street, number}
              address,
              pois: Array.isArray(pois) ? pois.map(v => { // 定位点附近的 POI 信息，结构是：{name, address, ...其他参数}
                return { ...v, name: v.title }
              }) : undefined,
              origin: result // 接口返回的原始数据
            }
            resolve(newResult)
          }).catch(err => {
            reject(new Error(`逆地理编码失败: ${err.message}`))
          })
        },
        fail: (err) => {
          reject(new Error(err.errMsg))
        }
      })
    })
  },
  // 关闭当前页面
  closeWindow() {
    wx.closeWindow()
  }
}
