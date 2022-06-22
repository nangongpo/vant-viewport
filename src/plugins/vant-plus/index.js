const components = []

const requireComponent = require.context(
  // 其组件目录的相对路径
  './components',
  // 是否查询其子目录
  true,
  // 匹配基础组件文件名的正则表达式
  /.(vue|js)$/
)

requireComponent.keys().forEach(fileName => {
  // 获取组件配置
  const compConfig = requireComponent(fileName)
  components.push(compConfig.default || compConfig)
})

export default components
