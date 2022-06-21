import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import createPersistedState from './plugins/vuex-persistedstate'

Vue.use(Vuex)

const modulesFiles = require.context('./modules', true, /\.js$/)

// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

// 持久化存储
const persistedState = createPersistedState({
  storage: window.sessionStorage,
  paths: ['user', 'app.showDebug']
})

export default new Vuex.Store({
  modules,
  getters,
  plugins: [persistedState]
})
