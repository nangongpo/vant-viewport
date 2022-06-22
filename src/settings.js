const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  name: 'vant-viewport',
  title: 'vant-viewport',
  publicPath: isProd ? '/vant-viewport/' : '/vant-viewport/',
  outputDir: 'dist',
  assetsDir: 'static',
  devPort: 8080,
  previewPort: 8080
}
