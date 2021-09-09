const webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.config.js');

module.exports = merge(common, {
  mode: 'development',
  devServer: {
    historyApiFallback: true,
    hot: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        secure: false,
      },
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      ENV_API_URL: JSON.stringify(process.env.DEV_API_URL),
    }),
  ],
});
