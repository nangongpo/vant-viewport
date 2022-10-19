'use strict'
const path = require('path')
const webpack = require('webpack')
const defaultSettings = require('./src/settings.js')
const pxtorem = require('postcss-pxtorem')

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
    host: '0.0.0.0',
    port: devPort,
    open: false,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      // 微信jssdk接口
      '/cgi-bin/': {
        target: 'https://api.weixin.qq.com',
        origin: true
      },
      // 腾讯地图 WebService API
      '/ws': {
        target: 'https://apis.map.qq.com',
        origin: true
      }
    }
  },
  // pwa: {
  //   name: name,
  //   workboxPluginMode: 'InjectManifest',
  //   workboxOptions: {
  //     swSrc: path.resolve(__dirname, 'src/pwa/service-worker.js')
  //   }
  // },
  css: {
    // extract: IS_PROD,
    sourceMap: false,
    loaderOptions: {
      postcss: {
        plugins: [
          pxtorem({
            rootValue: 37.5, // iPhone6，设备宽度375px, 基准值=当前设备宽度的1/10
            unitPrecision: 5,
            propList: ['*']
          })
        ]
      },
      less: {
        modifyVars: {
          hack: `true; @import "~@/styles/vant-theme.less";`
        }
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

    // 10kb以内的图片会被打包成内联元素
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => Object.assign(options, { limit: 10240 }))

    // CopyWebpackPlugin插件
    // config
    //   .plugin('copy')
    //   .tap(args => {
    //     args[0][0].ignore.push('**/*/**')
    //     args[0].push({
    //       from: resolve('public'),
    //       to: resolve(`${outputDir}/${assetsDir}`),
    //       toType: 'dir',
    //       ignore: ['img/*', '.jpg', '.jpeg', '.png', '.ico', 'index.html']
    //     })
    //     return args
    //   })

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
                  maxSize: 450 * 1024,
                  reuseExistingChunk: true,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                vant: {
                  name: 'chunk-vant',
                  priority: 20,
                  maxSize: 300 * 1024,
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
