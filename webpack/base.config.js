const autoprefixer = require('autoprefixer');
const path = require('path');

const pkg = require('../package.json');
const schema = require('../src/schema.json');

const { extractCss } = require('./extract-plugins');

const PROD = process.env.NODE_ENV === 'production';

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
        options: Object.assign({}, pkg.config, { schema: JSON.stringify(schema) }),
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
      test: /\.(png|jpg|ttf|otf|woff)$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 10 * 1024,
          name: '[hash].[ext]',
          outputPath: 'images/',
        },
      }]
    }, {
      test: /\.svg$/,
      use: [{
        loader: 'file-loader',
        options: {
          name: '[hash].[ext]',
          outputPath: 'images/',
        },
      }]
    }],
  },

  resolve: {
    extensions: ['.js', '.json', '.css'],
  },
}
