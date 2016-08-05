const path = require('path');
const webpack = require('webpack');

module.exports = (options) => ({
  entry: options.entry,
  output: Object.assign({
    path: path.resolve(process.cwd(), 'build'),
    publicPath: '/',
  }, options.output),
  module: {
    loaders: [{
      test: /\.json$/,
      loader: 'json-loader',
    }, {
      test: /\.js$/,
      loader: 'babel',
      exclude: /node_modules/,
      query: options.babelQuery,
    }, {
      test: /\.css$/,
      include: /src/,
      loader: options.cssLoaders,
    }, {
      test: /\.css$/,
      include: /lib/,
      loader: 'style-loader!css-loader',
    }],
  },
  plugins: options.plugins.concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
  ]),
  postcss: () => options.postcssPlugins,
  resolve: {
    modules: ['src/demo', 'node_modules'],
    extensions: [
      '',
      '.js',
    ],
    packageMains: [
      'jsnext:main',
      'main',
    ],
  },
  devtool: options.devtool,
  target: 'web',
  stats: false,
  progress: true,
});
