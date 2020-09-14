const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: './build/compiled/index.js',
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'build', 'final')
  },
  node: {
    fs: 'empty'
  },
  target: 'node',
  plugins: [new CleanWebpackPlugin(), new webpack.ProgressPlugin()]
};
