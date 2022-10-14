const getters = {
  showDebug: state => state.app.showDebug,
  device: state => state.app.device,
  app: state => state.app.app,
  appReady: state => state.app.appReady,
  code: state => state.user.code,
  userInfo: state => state.user.info
}

export default getters
