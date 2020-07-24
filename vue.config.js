// const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
// 打包分析工具，可选用
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// sentry 接入，可选用
// const SentryPlugin = require('@tencent/webpack-sentry-plugin');

const glob = require('glob')
const IS_PRODUCTION = process.env.NODE_ENV === 'production'
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
  lintOnSave: false, // console
  outputDir: IS_PRODUCTION ? './dist' : './pre',
  productionSourceMap: !IS_PRODUCTION,
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
      'pixi.js-legacy': 'PIXI'
    })
    config.plugin('html-test').tap(args => {
      args[0].MODE = IS_PRODUCTION ? '正式服' : '测试服'
      return args
    })
  },
  configureWebpack: config => {
    // const plugins = [
    //   new UglifyJsPlugin({
    //     uglifyOptions: {
    //       compress: {
    //         drop_console: true
    //       }
    //     },
    //     sourceMap: true
    //   })
    // ]
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
        },
        'lottie-web': {
          name: 'lottie-web',
          test: /lottie-web/,
          chunks: 'initial',
          enforce: true,
          priority: 10
        }
      }
    }
    if (IS_PRODUCTION) {
      // config.plugins = [...config.plugins, ...plugins]
      // config.optimization.splitChunks = splitChunksConfig
    }
    if (IS_PRODUCTION) {
      config.optimization = {
        minimizer: [
          compiler => {
            const TerserPlugin = require('terser-webpack-plugin')
            new TerserPlugin({
              parallel: 4, // 并行打包
              sourceMap: !IS_PRODUCTION,
              terserOptions: {
                ecma: undefined,
                warnings: false,
                parse: {},
                compress: {
                  drop_debugger: !IS_PRODUCTION,
                  drop_console: !IS_PRODUCTION
                },
                mangle: true, // Note `mangle.properties` is `false` by default.
                module: false,
                output: null,
                toplevel: false,
                nameCache: null,
                ie8: false,
                keep_classnames: undefined,
                keep_fnames: false,
                safari10: false
              }
            }).apply(compiler)
          }
        ],
        // 分割、提供公共代码
        splitChunks: {
          cacheGroups: splitChunksConfig.cacheGroups
        }
      }
      config.output.filename = 'js/[name].[contenthash:8].js' // contenthash hash chunkhash
      config.output.chunkFilename = 'js/[name].[contenthash:8].js'
    }
  }
}
