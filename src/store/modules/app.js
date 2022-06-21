/* eslint-disable no-unused-vars */
import { getDeviceType, getAppBrowserName, getBrowserNameVersion } from '@/utils/device'
import Jssdk from '@/jssdk'
import { showAlert } from '@/jssdk/util'
import { Promise } from 'core-js'

const state = {
  showDebug: false, // 显示控制台
  device: null, // 设备信息
  app: null, // jssdk
  appReady: () => new Promise() // 封装jssdk， promise
}

const mutations = {
  SET_DEBUG(state, bool) {
    state.showDebug = bool
  },
  SET_DEVICE(state, device) {
    state.device = device
  },
  SET_APP(state, app) {
    state.app = app
    state.appReady = (apiName, config) => {
      if (!app.checkJsApi(apiName)) {
        showAlert(`${apiName}方法不存在`)
        return
      }
      return app[apiName](config)
    }
  }
}

const actions = {
  getDevice: ({ commit, dispatch }) => {
    return new Promise((resolve, reject) => {
      const browserInfo = getBrowserNameVersion()
      const device = {
        ...browserInfo,
        type: getDeviceType(), // 设备 ios、android、pc
        appBrowser: getAppBrowserName() || browserInfo.browser // app内置浏览器
      }
      commit('SET_DEVICE', device)
      window.$device = device
      resolve(device)
    })
  },
  // 初始化jssdk脚本
  loadJssdk({ state, commit }, device) {
    return new Promise((resolve, reject) => {
      if (state.app) {
        return resolve(state.app)
      }
      new Jssdk(device.appBrowser).load().then(app => {
        commit('SET_APP', app)
        resolve(app)
      }).catch(reject)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
