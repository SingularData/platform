const webpack = require('webpack');
const path = require('path');

const HtmlWebpackPlugin  = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const nodeExternals = require('webpack-node-externals');

let fontend = {
  devtool: 'eval',
  entry: {
    app: path.resolve(__dirname, '../src/www/bootstrap.ts')
  },
  output: {
    path: path.resolve(__dirname, '../public/www'),
    filename: '[name].[hash].bundle.js',
    sourceMapFilename: '[name].[hash].map',
    chunkFilename: '[id].[hash].chunk.js'
  },
  resolve: {
    extensions: ['.ts', '.js', '.html', '.less', '.css']
  },
  module: {
    rules: [
      { test: /\.ts$/, enforce: 'pre', loader: 'tslint-loader' },
      { test: /\.ts$/, use: ['ts-loader'] },
      { test: /\.html$/, use: [{ loader: 'html-loader', options: { minimize: false } }] },
      { test: /\.less$/, use: ['to-string-loader', 'css-loader', 'less-loader'] },
      { test: /\.css$/, use: ExtractTextPlugin.extract({ use: 'css-loader' })},
      { test: /\.(png|gif|jpg|jpeg)$/, use:[{ loader: 'file-loader', options: { name: 'media/images/[name].[ext]'} } ]},
      { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, use:[{ loader: 'file-loader', options: { name: 'fonts/[name].[ext]'} } ]},
      { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, use:[{ loader: 'file-loader', options: { name: 'fonts/[name].[ext]'} } ]},
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, use:[{ loader: 'file-loader', options: { name: 'fonts/[name].[ext]'} } ]},
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, use:[{ loader: 'file-loader', options: { name: 'fonts/[name].[ext]'} } ]},
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, use:[{ loader: 'file-loader', options: { name: 'fonts/[name].[ext]'} } ]}
    ]
  },
  plugins: [
    new ExtractTextPlugin("[name].[contenthash].css"),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/www/index.html'),
      inject: true
    }),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'defer'
    }),
    new WebpackCleanupPlugin({
      exclude: ['index.html', 'fonts/**/*', 'images/**/*']
    })
  ]
};

let backend = {
  target: 'node',
  externals: [nodeExternals()],
  entry: {
    server: path.resolve(__dirname, '../src/server.ts')
  },
  output: {
    path: path.resolve(__dirname, '../public'),
    filename: '[name].bundle.js',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      { test: /\.ts$/, enforce: 'pre', loader: 'tslint-loader' },
      { test: /\.ts$/, use: ['ts-loader'] }
    ]
  }
};

module.exports = [fontend, backend];
