/* eslint-disable import/no-extraneous-dependencies */

'use strict';

const webpack = require('webpack');
const CleanPlugin = require('clean-webpack-plugin');
const JsUglifyPlugin = require('uglifyjs-webpack-plugin');
const CssExtractPlugin = require('mini-css-extract-plugin');
const CssOptimizePlugin = require('optimize-css-assets-webpack-plugin');
const CssPurgePlugin = require('purgecss-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const path = require('path');
const glob = require('glob');

module.exports = (settings) => {
  function isProduction() {
    return settings.env === 'production';
  }

  const optimization = {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendor',
          test: /\/node_modules\//,
          chunks: 'all',
          priority: -10,
          enforce: true,
        },
      },
    },
  };
  if (isProduction()) {
    optimization.minimizer = [
      new JsUglifyPlugin({cache: true, parallel: true}),
      new CssOptimizePlugin({}),
    ];
  }

  return {
    optimization,
    mode: settings.env,
    devtool: isProduction() ? false : 'source-map',
    entry: {
      main: path.resolve('client', 'src', 'main.ts'),
    },
    output: {
      path: path.resolve('dist'),
      filename: '[name].[chunkhash].js',
    },
    resolve: {
      extensions: ['.ts', '.js'],
      modules: [
        path.resolve('client', 'src'),
        path.resolve('node_modules'),
      ],
      plugins: [new TsconfigPathsPlugin()],
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: ['ts-loader', 'angular2-template-loader'],
          include: path.resolve('client', 'src'),
        },
        {
          test: /\.html$/,
          use: ['html-loader'],
          include: path.resolve('client', 'src'),
        },
        {
          test: /\.css$/,
          use: [CssExtractPlugin.loader, 'css-loader'],
          include: [
            path.resolve('node_modules', 'bootstrap', 'dist', 'css', 'bootstrap.css'),
            path.resolve('node_modules', 'angular-calendar', 'css', 'angular-calendar.css'),
          ],
        },
        {
          test: /\.less$/,
          use: [CssExtractPlugin.loader, 'css-loader', 'less-loader'],
          include: path.resolve('client', 'src', 'assets', 'styles'),
        },
        {
          test: /\.(png|jpe?g|gif|svg|ico)$/,
          use: [{
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
              context: path.resolve('client', 'src'),
            },
          }],
          include: path.resolve('client', 'src', 'assets', 'img'),
        },
        {
          test: /\.(woff(2)?|ttf|otf|eot|svg)$/,
          use: [{
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
              context: path.resolve('client', 'src'),
            },
          }],
          include: path.resolve('client', 'src', 'assets', 'fonts'),
        },
      ],
    },
    plugins: [
      new CleanPlugin(['dist'], {root: path.resolve()}),
      new webpack.optimize.ModuleConcatenationPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          API_URL: JSON.stringify(settings.apiUrl),
          WEB_URL: JSON.stringify(settings.webUrl),
        },
      }),
      new CssExtractPlugin({filename: 'assets/styles/[name].[chunkhash].css'}),
      new CssPurgePlugin({
        paths: glob.sync(`${path.resolve('client', 'src')}/**/*`, {nodir: true}),
        whitelist: ['collapse', 'fade', 'show', 'arrow', 'd-block', 'custom-select', 'btn-link', 'btn-light', 'fieldset', 'loading-bar-spinner', 'ck-editor'],
        whitelistPatterns: [/^modal/, /^dropdown/, /^popover/, /^bs-popover/, /^alert/, /^bg-/, /^ng-/, /^ngb-/, /^cal-/, /^pac-/],
      }),
      new HtmlPlugin({template: path.resolve('client', 'src', 'index.html')}),
    ],
  };
};
