// 用来模拟线上前端情况，在终端执行 npm run preview
process.env.NODE_ENV = 'production'

const { sh } = require('tasksfile')
const chalk = require('chalk')
const rawArgv = process.argv.slice(2)
const args = rawArgv.join(' ')

const config = require('../vue.config.js')
const defaultSettings = require('../src/settings')

if (process.env.npm_config_preview || rawArgv.includes('--preview')) {
  const report = rawArgv.includes('--report')

  sh(`vue-cli-service build ${args}`)

  const port = defaultSettings.previewPort
  const publicPath = config.publicPath

  var connect = require('connect')
  var serveStatic = require('serve-static')
  const app = connect()

  app.use(
    publicPath,
    serveStatic('./dist', {
      index: ['index.html', '/']
    })
  )

  app.listen(port, function() {
    console.log(chalk.green(`> Preview at  http://localhost:${port}${publicPath}`))
    if (report) {
      console.log(chalk.green(`> Report at  http://localhost:${port}${publicPath}report.html`))
    }
  })
} else {
  sh(`vue-cli-service build ${args}`)
}
