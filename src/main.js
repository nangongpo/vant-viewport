import 'amfe-flexible'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import '@/styles/index.less'

import '@/pwa/register-service-worker'
import '@/utils/vconsole.js'

import vueNativeNavigation from 'vue-native-navigation'
import preventReClick from '@/directives/preventReClick'
import vant from '@/plugins/vant'

Vue.use(vueNativeNavigation)
Vue.use(preventReClick)
Vue.use(vant)

router.beforeEach((to, from, next) => {
  // 登录页
  const whiteList = ['/', '/login']
  if (!whiteList.includes(to.path)) {
    store.dispatch('app/getDevice').then(device => {
      store.dispatch('app/loadJssdk', device)
      next()
    })
    return
  }
  next()
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
