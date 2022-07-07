import './utils/lib-flexible'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import '@/styles/index.less'

import '@/pwa/register-service-worker'

import vueNativeNavigation from 'vue-native-navigation'
import click from '@/directives/click'
import vant from '@/plugins/vant'

Vue.use(vueNativeNavigation)
Vue.use(click)
Vue.use(vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
