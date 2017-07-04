const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const pkg = require('../package.json');

const { extractCss } = require('./extract-plugins');


const rootPath = path.resolve(__dirname, '../');
const cssLoaders = [{
    loader: 'css-loader',
    options: {
      importLoaders: 2,
      sourceMap: true,
    },
  }, {
    loader: 'postcss-loader',
    options: {
      plugins: () => [autoprefixer()],
      sourceMap: true,
    }
  }, {
    loader: 'sass-loader',
    options: {
      sourceMap: true,
    },
  },
];


module.exports = {
  context: rootPath,
  entry: ['./src/index.js', './src/index.scss'],
  output: {
    path: path.resolve(rootPath, './dist'),
    filename: '[hash].js',
    publicPath: '/',
    sourceMapFilename: '[hash].map'
  },
  target: 'web',
  stats: 'errors-only',

  module: {
    rules: [{
      test: /\.js$/,
      include: [path.resolve(rootPath, 'src')],
      loader: 'babel-loader',
    }, {
      test: /\.ejs$/,
      use: [{
        loader: 'html-loader',
        options: {
            root: path.resolve(rootPath, './dist'),
        }
      }, {
        loader: 'ejs-html-loader',
        options: pkg.config,
      }],
    }, {
      test: /\.scss$/,
      // HACK: extract-text plugin doesn't work with html-plugin, so they have to
      // be exclusive
      use: process.env.NODE_ENV === 'production' ? extractCss.extract(cssLoaders) : [
        'style-loader',
        ...cssLoaders,
      ],
    }, {
      test: /\.(png|jpg|svg|ttf|otf|woff)$/,
      use: [{
        loader: 'file-loader',
        options: {
          name: '[hash].[ext]',
          publicPath: '/images/',
          outputPath: 'images/',
        },
      }]
    }],
  },

  resolve: {
    extensions: ['.js', '.json', '.css'],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(rootPath, './src/index.ejs'),
    }),
  ],
}
