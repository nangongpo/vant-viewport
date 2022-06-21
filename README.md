# weixin_pass_vant

## 项目开发注意事项
  - vant采用按需引入, 默认全局注册的组件有 button、cell、cell-group、image、popup、toast、dialog, 常用组件请自行在 src/plugins/vant.js
  - 根据运行环境， 自动加载对应环境的jsapi
    - 微信(jsapi: 1.6.0, window.wx)：https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html
    - 支付宝(jsapi: 3.1.1, window.ap)：http://myjsapi.alipay.com/alipayjsapi/index.html

## 任务
  - [x] pwa做自动更新提示(仅生产环境启用，且需要https) src/pwa
  - [x] 导航故障提示 src/router/index.js
  - [x] 断网提示
  - [x] 页面切换时的过场动画 vue-native-navigation
  - [x] 集成VConsole, 连续点击屏幕左上角空白区域 5次
  - [x] 常见app h5接入，这里只要指支付宝、微信
  - [ ] CSRF与XSS的防御
  - [ ] 解决ios上输入框输入时，输入法隐藏导致的页面留白问题，及输入法隐藏时某些android机型页面高度变窄，导致用户无法操作等常见问题

## 交互流程
  login (getCode) => home (loadJssdk: 强刷新也会重载) => list => detail

## github gh-pages
  ```
  yarn build
  git add -f dist
  git commit
  git subtree push --prefix=dist origin gh-pages
  ```

## 小知识
  - chrome 对安全源的设定
    ```
    (https, *, *)
    (wss, *, *)
    (*, localhost, *)
    (*, 127/8, *)
    (*, ::1/128, *)
    (file, *, —)
    (chrome-extension, *, —)
    ```

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
