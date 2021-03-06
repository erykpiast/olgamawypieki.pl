const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { DefinePlugin, HotModuleReplacementPlugin, NamedModulesPlugin } = require('webpack');
const merge = require('webpack-merge');

const baseConfig = require('./base.config');

const rootPath = path.resolve(__dirname, '../');


module.exports = merge(baseConfig, {
  entry: [
    `webpack-dev-server/client?http://localhost:8080`,
    'webpack/hot/only-dev-server',
    './src/index.ejs',
  ],
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(rootPath, './dist'),
    compress: true,
    historyApiFallback: false,
    hot: true,
    https: false,
    noInfo: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(rootPath, './src/index.ejs'),
    }),
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    new HotModuleReplacementPlugin(),
    new NamedModulesPlugin(),
  ]
});
