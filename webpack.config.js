var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var env = process.env.NODE_ENV || "development";

var debug = ["development", "test"].indexOf(env) !== -1;
var development = env === 'development';
var production = env === 'production';

var defaults = {
  devtool: debug ? "source-map" : false,
  watch: development,
  
  entry: {
    application: './src/application'
  },
  
  output: {
      publicPath: '/',
      filename: 'application.js'
  },
  
  module: {
    loaders: [{
      test: /\.ts(x?)$/,
      exclude: /node_modules/,
      loader: 'babel-loader!ts-loader'
    },
    {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets:[ 'latest' ]
      }
    }]
  },
  
  plugins: [
  ],
  
  devServer: {
    contentBase: "./src"
  },
  
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  }
};

var config = defaults;

if(production){
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  )
}


module.exports = config;
