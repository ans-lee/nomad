const webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.config.js');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      ENV_API_URL: JSON.stringify(process.env.PROD_API_URL),
    }),
  ],
});
