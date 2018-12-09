const express        = require('express')
const path           = require('path')
const favicon        = require('serve-favicon')
const cookieParser   = require('cookie-parser')
const compression    = require('compression')
const proxy          = require('http-proxy-middleware')

//定义边界
const _NODE_ENV_PRO = 'production' //生产边界
const _NODE_ENV_DEV = 'development' //开发边界
const _NODE_ENV = process.env.NODE_ENV || _NODE_ENV_DEV

const app = express()

const historyApiFallbackMiddleware = require('./server/middlewares/historyApiFallbackMiddleware')

const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const webpackDevConfig = require('./webpack.config')
const compiler = webpack(webpackDevConfig)
const cfg = require('./config/appConfig')


// 设置渲染tpl
app.set('views', path.join(__dirname, 'server/views'))
app.set('view engine', 'ejs')
app.disable('x-powered-by')

app.use(compression())
// static 文件
//app.use(favicon(path.join(__dirname, '/', 'favicon.ico')))
app.use(cookieParser())

// 会默认寻找index.html
app.use('/dist', express.static(path.join(__dirname, 'dist')))
// 系统维护页面静态页
app.use('/error.html', express.static(path.join(__dirname, '/server/views/error.html')))

app.use('*', (req,res,next) => {
  if(cfg.repairingCfg.systemShutDown){
    return res.redirect('/error.html')
  }
  next()
})

app.use('/api/', proxy({
  target: `${cfg.fw}`,
  changeOrigin: true,
  pathRewrite: {
    '^/api/v1/': '/v1/',
    '^/api/v2/': '/v2/' // remove base path  还有一种方式是rewrite basePath
  },
  headers:{'content-type': 'application/json;charset=utf-8'}
}));

app.use('/upload/', proxy({
  target: `${cfg.fw}`,
  changeOrigin: true,
  pathRewrite: {
    '^/upload/v2/': '/v2/'
  }
}));

//如果是
if(_NODE_ENV === _NODE_ENV_DEV) {
  app.use(webpackDevMiddleware(compiler, {
    publicPath: webpackDevConfig.output.publicPath,
    headers   : {"X-Custom-Header": "proxy-enable"},
    stats     : {
      colors: true
    }
  }))
  app.use(webpackHotMiddleware(compiler))
  app.use(historyApiFallbackMiddleware(compiler))
}

// 后端404
app.use(function (req, res, next) {
  if (_NODE_ENV === _NODE_ENV_PRO)
    res.render('index.ejs');
  else {
    const err = new Error('Not Found')
    err.status = 404
    next(err)
  }
})

// 如果都没抓住则使用error
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error   = req.app.get('env') === 'development' ? err : {}
  res.render('error')
})

module.exports = app
