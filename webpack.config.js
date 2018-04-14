/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { NODE_ENV = 'development', PORT = '8080', DOCKER } = process.env;

const nodeEnv = NODE_ENV;
const isDevelopment = nodeEnv === 'development';
const isProduction = nodeEnv === 'production';

const htmlConfig = {
  filename: 'index.html',
  template: 'src/front.html',
  title: 'App',
  mobile: true,
};

const common = {
  entry: {
    script: ['./src/front'],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].[hash].js',
    publicPath: '/',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(NODE_ENV),
      },
    }),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: isDevelopment,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
  },
};

const production = {
  plugins: [
    ...common.plugins,
    new HtmlWebpackPlugin({
      ...htmlConfig,
      production: true,
    }),
  ],
};

const development = {
  plugins: [
    ...common.plugins,
    new HtmlWebpackPlugin(htmlConfig),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
  ],
  devServer: {
    stats: { colors: true },
    host: DOCKER ? '0.0.0.0' : 'localhost',
    port: Number(PORT) || 8080,
  },
};

module.exports = {
  ...common,
  ...(isProduction && production),
  ...(isDevelopment && development),
};
