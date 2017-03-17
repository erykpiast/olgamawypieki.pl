const { DefinePlugin, optimize } = require('webpack');
const { UglifyJsPlugin } = optimize;
const merge = require('webpack-merge');

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
  ],
});
