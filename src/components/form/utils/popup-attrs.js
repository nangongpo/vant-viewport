// 改写van-popup的默认属性
export default {
  overlay: true,
  position: 'bottom', // top bottom right left center
  'overlay-class': '',
  'overlay-style': {},
  duration: 0.3, // 	动画时长，单位秒
  round: true,
  'lock-scroll': true,
  'lazy-render': true,
  'close-on-popstate': true, // 是否在页面回退时自动关闭
  closeable: false, // 是否显示关闭图标
  'close-icon': 'cross',
  'close-icon-position': 'top-right', // top-right top-left bottom-left bottom-right
  transition: '', // 动画类名，等价于 transition 的name属性
  'transition-appear': false, // 是否在初始渲染时启用过渡动画
  'get-container': 'body',
  'safe-area-inset-bottom': false // https://vant-contrib.gitee.io/vant/v2/#/zh-CN/advanced-usage#di-bu-an-quan-qu-gua-pei
}
