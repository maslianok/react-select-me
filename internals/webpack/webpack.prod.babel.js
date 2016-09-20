// Important modules this config uses
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = require('./webpack.base.babel')({
  // In production, we skip all hot-reloading stuff
  entry: [
    path.join(process.cwd(), 'src/demo/app.js'),
  ],

  // Utilize long-term caching by adding content hashes (not compilation hashes) to compiled assets
  output: {
    publicPath: '',
    filename: '[name].js',
  },

  cssLoaders: 'style-loader!css-loader?modules&-autoprefixer&importLoaders=1!postcss-loader',
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(true),

    // Merge all duplicate modules
    new webpack.optimize.DedupePlugin(),

    // Minify and optimize the JavaScript
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    }),

    // Minify and optimize the index.html
    new HtmlWebpackPlugin({
      template: 'src/demo/index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
      inject: true,
    }),
  ],
});
