import './utils/lib-flexible'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import '@/styles/index.less'

import '@/pwa/register-service-worker'

import vueNativeNavigation from 'vue-native-navigation'
import preventReClick from '@/directives/preventReClick'
import vant from '@/plugins/vant'
import { apiReady } from '@/jssdk'

Vue.use(vueNativeNavigation)
Vue.use(preventReClick)
Vue.use(vant)

Vue.prototype.$apiReady = apiReady
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
