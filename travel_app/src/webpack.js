const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: "development",
  entry: "./main.ts",
  devtool: 'inline-source-map',
  output: {
    filename: "main.[contenthash].js",
    path: path.resolve("../", "dist"),
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true
            }
          }
        ],
        include: /\.module\.css$/
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ],
        exclude: /\.module\.css$/
      },
      {
        test: /\.html$/i,
        exclude: /node_modules/,
        loader: "html-loader",
      },

    ],
  },
  plugins: [
    new HtmlWebpackPlugin({

      template: 'template.html',
      filename: 'app.html',
      publicPath: '/dist/'

    })
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
};
