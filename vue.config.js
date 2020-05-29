const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
// 打包分析工具，可选用
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// sentry 接入，可选用
// const SentryPlugin = require('@tencent/webpack-sentry-plugin');

const glob = require('glob')

// 统一配置多页
const pages = {}
glob.sync('./src/pages/**/main.js').forEach(filePath => {
  let chunk = filePath.split('./src/pages/')[1].split('/main.js')[0]
  pages[chunk] = {
    entry: filePath,
    template: `public/${chunk}.html`,
    chunks: ['chunk-vendors', 'chunk-common', chunk]
  }
})
module.exports = {
  publicPath: './',
  pages,
  lintOnSave: true,
  outputDir: './dist',
  productionSourceMap: !(process.env.NODE_ENV === 'production'),
  devServer: {
    port: 83,
    proxy: {
      '/openplatform': {
        target: 'http://127.0.0.1:80',
        ws: true,
        changeOrigin: true
      }
    } // 配置开发环境 URL 便于本地开发调试
  },
  chainWebpack: config => {
    // 由于兼容问题需禁用 preload / prefech 插件
    // config.plugins.delete('named-chunks')
    // config.plugins.delete('preload-index')
    // config.plugins.delete('preload-test')
    config.externals({
      // 'element-ui': 'ELEMENT'
    })
  },
  configureWebpack: config => {
    const plugins = [
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            drop_console: true
          }
        },
        sourceMap: true
      })
    ]
    // splitChunk 配置
    const splitChunksConfig = {
      cacheGroups: {
        vendors: {
          name: 'chunk-vendors',
          test: /[\\\/]node_modules[\\\/]/,
          priority: -10,
          chunks: 'initial'
        },
        common: {
          name: 'chunk-common',
          minChunks: 2,
          priority: -20,
          chunks: 'initial',
          reuseExistingChunk: true
        },
        'bootstrap-vue': {
          name: 'bootstrap-vue',
          test: /bootstrap-vue/,
          chunks: 'initial',
          enforce: true,
          priority: 10
        },
        'element-ui': {
          name: 'element-ui',
          test: /element-ui/,
          chunks: 'initial',
          enforce: true,
          priority: 10
        }
      }
    }
    if (process.env.NODE_ENV === 'production') {
      config.plugins = [...config.plugins, ...plugins]
      config.optimization.splitChunks = splitChunksConfig
    }
  }
}
