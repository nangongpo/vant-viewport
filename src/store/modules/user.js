/* eslint-disable no-unused-vars */
const state = {
  code: null,
  token: null,
  info: null
}

const mutations = {
  SET_CODE(state, code) {
    state.code = code
  },
  SET_TOKEN(state, token) {
    state.token = token
  },
  SET_LOGIN_INFO(state, info) {
    state.info = info
  }
}

const actions = {
  login({ commit }, payload) {
    const { code } = payload
    return new Promise((resolve, reject) => {
      commit('SET_CODE', code)
      commit('SET_TOKEN', '123')
      commit('SET_LOGIN_INFO', {})
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
