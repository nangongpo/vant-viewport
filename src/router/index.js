import Vue from 'vue'
import VueRouter from 'vue-router'

// hack router push callback
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => {
    this.$dialog.confirm({
      type: 'primary',
      title: '导航故障',
      message: err.message,
      confirm: '关闭',
      confirmButtonText: '返回上一页',
      duration: 0
    }).then(() => {
      window.history.go(-1)
    })
  })
}

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/Login.vue')
  },
  {
    path: '/',
    name: 'Home',
    meta: { depth: 1 },
    component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue')
  },
  {
    path: '/click-delay',
    name: 'ClickDelay',
    meta: { depth: 1 },
    component: () => import(/* webpackChunkName: "click-delay" */ '@/views/ClickDelay.vue')
  },
  {
    path: '/form',
    name: 'Form',
    meta: { depth: 2 },
    component: () => import(/* webpackChunkName: "form" */ '@/views/Form.vue')
  },
  {
    path: '/signature',
    name: 'Signature',
    meta: { depth: 2 },
    component: () => import(/* webpackChunkName: "form" */ '@/views/Signature.vue')
  },
  {
    path: '/list',
    name: 'List',
    meta: { depth: 2 },
    component: () => import(/* webpackChunkName: "list" */ '@/views/List.vue')
  },
  {
    path: '/detail/:id',
    name: 'Detail',
    props: true,
    meta: { depth: 3 },
    component: () => import(/* webpackChunkName: "detail" */ '@/views/Detail.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
