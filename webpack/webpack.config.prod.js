const webpack = require('webpack');
const path = require('path');
const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.config.common.js');

const OptimizeJsPlugin = require('optimize-js-plugin');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractLess = new ExtractTextPlugin({
  filename: "[name].[contenthash].css"
});

module.exports = webpackMerge(commonConfig, {
  devtool: 'source-map',
  entry: {
    vendor: path.resolve(__dirname, '../src/www/vendor.ts'),
    app: path.resolve(__dirname, '../src/www/bootstrap.aot.ts')
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: extractLess.extract({
          use: [{
            loader: "css-loader"
          }, {
            loader: "less-loader"
          }],
          fallback: "style-loader"
        })
      }
    ]
  },
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
    }),
    extractLess
  ]
});
