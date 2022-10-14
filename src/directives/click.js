import { debounce } from 'lodash-es'

// 使用方法：'<van-button type="info" round block v-click="getLocation">获取当前位置</van-button>'
// 延迟300ms '<van-button type="info" round block v-click:300="getLocation">获取当前位置</van-button>'
// 延迟开始前调用 '<van-button type="info" round block v-click.leading="getLocation">获取当前位置</van-button>'
// 延迟结束后调用 '<van-button type="info" round block v-click.trailing="getLocation">获取当前位置</van-button>'

export default {
  install(Vue) {
    // 防重复点击(指令实现)
    Vue.directive('click', {
      inserted(el, binding) {
        // https://www.lodashjs.com/docs/lodash.debounce
        const { value: func, arg, modifiers } = binding
        const wait = arg ? parseInt(arg) : 300
        const options = { leading: false, trailing: false, maxWait: 1000, ...modifiers }
        // 设置默认值：延迟开始前调用 leading === true
        if (!modifiers.leading && !modifiers.trailing) {
          options.leading = true
        }
        const debounced = debounce(func, wait, options)
        el.addEventListener('click', debounced)
      }
    })
  }
}
