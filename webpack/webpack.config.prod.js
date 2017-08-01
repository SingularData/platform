const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.config.common.js');

const OptimizeJsPlugin = require("optimize-js-plugin");
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

module.exports = webpackMerge(commonConfig, {
  devtool: 'source-map',
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new WebpackCleanupPlugin(),
    new OptimizeJsPlugin(),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorOptions: { discardComments: { removeAll: true } },
      canPrint: true
    }),
    new LodashModuleReplacementPlugin({
      collections: true,
      flattening: true,
      paths: true
    })
  ]
});
