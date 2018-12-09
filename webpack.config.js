const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')

const ASSET_PATH = process.env.ASSET_PATH || '/dist/'
const NODE_ENV = process.env.NODE_ENV || 'development'

module.exports = {
  entry: {},
  output: {
    chunkFilename: '[name].[chunkhash].chunk.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: ASSET_PATH
  },
  resolveLoader: {
    modules: ['node_modules'],
    extensions: ['.js', '.json'],
    mainFields: ['loader', 'main']
  },
  externals: {
    '$': 'window.jQuery',
    'jQuery': 'window.jQuery',
    'Vue': 'window.Vue',
    // 'VueRouter': 'window.VueRouter',
    'layer': 'window.layer',
    'echarts': 'window.echarts'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        use: 'json-loader'
      },
      {
        test: /\.(gif|jpg|png|woff|svg|eot|ttf)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          'to-string-loader',
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new ExtractTextPlugin({filename: 'css/style.css', allChunks: false})
  ]
}

if (NODE_ENV === 'production') {
  module.exports.mode = 'production'
  module.exports.entry.index = [
    './src/index.js'
  ]
  module.exports.output.filename = '[name].[chunkhash].js'
  module.exports.optimization = {
    splitChunks: {
      chunks: 'all',
      name: 'common'
    },
    runtimeChunk: {
      name: 'runtime'
    }
  }
  module.exports.plugins = (module.exports.plugins || []).concat([
    new HtmlWebpackPlugin({
      template: 'index.ejs',
      filename: path.join(__dirname, 'server', 'views', 'index.ejs'),
      inject: true
    }),
    new webpack.DefinePlugin({
      'NODE_ENV': JSON.stringify('production'),
      'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH)
    }),
    new webpack.BannerPlugin({
      banner: `Copyright  ©  2012-2018  JDCloud.com`
    })
  ])
  module.exports.devtool = 'source-map'
} else {
  module.exports.entry.index = [
    './src/index.js'
  ]
  module.exports.mode = 'development'
  module.exports.output.filename = '[name].js'
  module.exports.plugins = (module.exports.plugins || []).concat([
    new HtmlWebpackPlugin({
      template: 'index.ejs',
      inject: true
    }),
    new webpack.DefinePlugin({
      'NODE_ENV': JSON.stringify('development'),
      'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH)
    }),
    new webpack.HotModuleReplacementPlugin()
  ])
  module.exports.devtool = 'eval-source-map'
}
