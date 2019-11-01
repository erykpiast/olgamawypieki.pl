const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const path = require('path');
const ResourceHintsPlugin = require('resource-hints-webpack-plugin');
const { DefinePlugin, optimize } = require('webpack');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const merge = require('webpack-merge');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const HtmlWebpackExcludeAssetsPlugin = require('html-webpack-exclude-assets-plugin');

const pkg = require('../package.json');

const baseConfig = require('./base.config');
const extractCss = require('./extract-plugins');

const rootPath = path.resolve(__dirname, '../');

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
    new HtmlWebpackPlugin({
      template: path.resolve(rootPath, './src/index.ejs'),
      minify: {
        collapseWhitespace: true,
        conservativeCollapse: false,
        collapseBooleanAttributes: true,
        minifyCSS: true,
        minifyJS: true,
        preserveLineBreaks: false,
        removeAttributeQuotes: true,
        removeComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        sortAttributes: true,
        sortClassName: true,
        useShortDoctype: true,
      },
      preload: ['*.svg'],
      inlineSource: '.css$',
      excludeAssets: [/\.js$/],
    }),
    new HtmlWebpackInlineSourcePlugin(),
    new HtmlWebpackExcludeAssetsPlugin(),
    new ResourceHintsPlugin(),
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    extractCss.plugin,
    new ImageminPlugin({
      test: /(jpg|svg)$/i,
      pngquant: {
        quality: '10-30',
        speed: 4,
        optimizationLevel: 7,
        progressive: true,
      },
      svgo: {
        floatPrecision: 1,
        plugins: [{
          removeViewBox: true,
        }, {
          removeEmptyAttrs: true,
        }],
      },
    }),
    new FaviconsWebpackPlugin({
      logo: path.resolve(baseConfig.context, 'src/images/logo.svg'),
      prefix: 'images/favico-[hash:6]/',
      cache: true,
      inject: true,
      favicons: {
        title: pkg.config.title,
        background: '#fff',
        icons: {
          android: false,
          appleIcon: false,
          appleStartup: false,
          coast: false,
          favicons: true,
          firefox: false,
          opengraph: false,
          twitter: false,
          yandex: false,
          windows: false
        }
      }
    })
  ],

  optimization: {
    minimizer: [
      new TerserWebpackPlugin({
        sourceMap: true,
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  }
});
