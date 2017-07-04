const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const imageminMozjpeg = require('imagemin-mozjpeg');
const path = require('path');
const { DefinePlugin, optimize } = require('webpack');
const { UglifyJsPlugin } = optimize;
const merge = require('webpack-merge');

const pkg = require('../package.json');

const baseConfig = require('./base.config');
const { extractCss } = require('./extract-plugins');

module.exports = merge(baseConfig, {
  devtool: 'source-map',

  performance: {
    hints: 'warning',
    maxAssetSize: 20 * 1024,
    maxEntrypointSize: 10 * 1024,
    assetFilter(assetFilename) {
      return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
    }
  },

  plugins: [
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new UglifyJsPlugin({
      sourceMap: true,
    }),
    extractCss,
    new ImageminPlugin({
      test: /(gif|jpg|png)$/i,
      plugins: [imageminMozjpeg({
        quality: 80,
        progressive: true,
      })],
      gifsicle: {
        interlaced: false,
      },
      jpegtran: null,
      mozjpeg: {
        quality: '75-90',
      },
      pngquant: {
        quality: '75-90',
        speed: 4,
        optimizationLevel: 7,
        progressive: true,
      },
      svgo: {
        plugins: [{
          removeViewBox: true,
        }, {
          removeEmptyAttrs: true,
        }],
      },
    }),
    new FaviconsWebpackPlugin({
      logo: path.resolve(baseConfig.context, 'src/images/logo.svg'),
      prefix: 'images/favico-[hash]/',
      emitStats: true,
      persistentCache: true,
      inject: true,
      background: '#fff',
      title: pkg.config.title,
      icons: {
        android: true,
        appleIcon: true,
        appleStartup: true,
        coast: false,
        favicons: true,
        firefox: true,
        opengraph: false,
        twitter: true,
        yandex: false,
        windows: false
      }
    })
  ],
});
