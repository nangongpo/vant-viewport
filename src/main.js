import './utils/lib-flexible'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import '@/styles/index.less'

import '@/pwa/register-service-worker'

import click from '@/directives/click'
import vant from '@/plugins/vant'

Vue.use(click)
Vue.use(vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
