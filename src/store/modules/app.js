/* eslint-disable no-unused-vars */
import { getDeviceType, getAppBrowserName, getBrowserNameVersion } from '@/utils/device'

const state = {
  showDebug: false, // 显示控制台
  device: null // 设备信息
}

const mutations = {
  SET_DEBUG(state, bool) {
    state.showDebug = bool
  },
  SET_DEVICE(state, device) {
    state.device = device
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
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
