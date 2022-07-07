/* eslint-disable no-unused-vars */
import printJS from 'print-js'

export default {
  install(Vue) {
    // 打印(指令实现)
    Vue.directive('print', {
      inserted(el, binding) {
        console.log(el, binding)
      }
    })
  }
}
