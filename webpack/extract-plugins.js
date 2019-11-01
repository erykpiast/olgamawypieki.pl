const ExtractPlugin = require('mini-css-extract-plugin');

const extractCss = new ExtractPlugin('[name].css');


module.exports = { plugin: extractCss, loader: ExtractPlugin.loader };
