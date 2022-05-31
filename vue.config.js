'use strict'
const path = require('path')
const webpack = require('webpack')
const defaultSettings = require('./src/settings.js')
const pxToViewport = require('postcss-px-to-viewport')

// eslint-disable-next-line no-unused-vars
function resolve(dir) {
  return path.join(__dirname, dir)
}

const { name, publicPath, outputDir, assetsDir, devPort } = defaultSettings

module.exports = {
  publicPath: publicPath,
  outputDir: outputDir,
  assetsDir: assetsDir,
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    disableHostCheck: true,
    https: true,
    host: '0.0.0.0',
    port: devPort,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    }
  },
  pwa: {
    name: name,
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: path.resolve(__dirname, 'src/pwa/service-worker.js')
    }
  },
  css: {
    // extract: IS_PROD,
    sourceMap: false,
    loaderOptions: {
      postcss: {
        plugins: [
          pxToViewport({
            unitToConvert: "px",    // 需要转换的单位，默认为"px"
            viewportWidth: 1920,  // 视窗的宽度，对应pc设计稿的宽度，一般是1920, 对应移动端设计稿, 一般是375
            // viewportHeight: 1080,// 视窗的高度，对应的是我们设计稿的高度
            unitPrecision: 3,       // 单位转换后保留的精度
            propList: [     // 能转化为vw的属性列表
              "*"
            ],
            viewportUnit: "vw",     // 希望使用的视口单位
            fontViewportUnit: "vw",     // 字体使用的视口单位
            selectorBlackList: [],  // 需要忽略的CSS选择器，不会转为视口单位，使用原有的px等单位。
            minPixelValue: 1,       // 设置最小的转换数值，如果为1的话，只有大于1的值会被转换
            mediaQuery: false,      // 媒体查询里的单位是否需要转换单位
            replace: true,      // 是否直接更换属性值，而不添加备用属性
            exclude: /(\/|\\)(node_modules)(\/|\\)/,        // 忽略某些文件夹下的文件或特定文件，例如 'node_modules' 下的文件
          })
        ]
      }
    }
  },
  configureWebpack: {
    name: name,
    resolve: {
      alias: {
        // '@': resolve('src')
      }
    },
    plugins: [
      // 只保留中文包
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/),
      // 只打包改变的文件
      new webpack.HashedModuleIdsPlugin()
    ]
  },
  chainWebpack(config) {
    // it can improve the speed of the first screen, it is recommended to turn on preload
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        // to ignore runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])

    // when there are many pages, it will cause too many meaningless requests
    config.plugins.delete('prefetch')

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  maxInitialRequests: 5,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                corejs: {
                  name: 'chunk-core-js', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?core-js(.*)/ // in order to adapt to cnpm
                },
                vant: {
                  name: 'chunk-vant', // split elementUI into a single package
                  priority: 30, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?vant(.*)/ // in order to adapt to cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: path.resolve(__dirname, 'src/components'),
                  minChunks: 2, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          // https://webpack.js.org/configuration/optimization/#optimizationruntimechunk
          config.optimization.runtimeChunk('single')
        }
      )
  }
}