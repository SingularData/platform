const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.config.common.js');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');

module.exports = webpackMerge(commonConfig, {
  devtool: 'cheap-module-eval-source-map',
  plugins: [
    new WebpackCleanupPlugin({
      exclude: ['index.html', 'fonts/**/*', 'media/images/**/*']
    })
  ]
});
