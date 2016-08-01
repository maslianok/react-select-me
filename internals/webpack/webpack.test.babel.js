/**
 * TEST WEBPACK CONFIGURATION
 */

const path = require('path');
const webpack = require('webpack');
const modules = [
  'src/demo',
  'node_modules',
];

module.exports = {
  devtool: 'inline-source-map',
  isparta: {
    babel: {
      presets: ['es2015', 'react', 'stage-0'],
    },
  },
  module: {
    noParse: [
      /node_modules(\\|\/)sinon/,
      /node_modules(\\|\/)acorn/,
    ],
    preLoaders: [
      { test: /\.js$/,
        loader: 'isparta',
        include: path.resolve('src/'),
      },
    ],
    loaders: [
      {
        test: /\.css$/,
        loader: 'css-loader/locals?localIdentName=[local]_[hash:base64:5]&modules!postcss-loader',
      },
      {
        test: /sinon(\\|\/)pkg(\\|\/)sinon\.js/,
        loader: 'imports?define=>false,require=>false',
      }, {
        test: /\.js$/,
        loader: 'babel',
        exclude: [/node_modules/],
      }, {
        test: /\.jpe?g$|\.gif$|\.png$/i,
        loader: 'null-loader',
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
  ],

  node: {
    fs: 'empty',
    child_process: 'empty',
    net: 'empty',
    tls: 'empty',
  },

  externals: {
    jsdom: 'window',
    'react/addons': true,
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': 'window',
  },

  resolve: {
    modulesDirectories: modules,
    modules,
    alias: {
      sinon: 'sinon/pkg/sinon',
    },
  },
};
