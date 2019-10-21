const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const path = require('path');

const htmlPlugin = new HtmlWebPackPlugin({
  template: './src/index.html',
  filename: './index.html',
});

// const copyConfig = new CopyWebpackPlugin([  {
//     from: './static',
//     to: '.',
// },]);

const progressBarPlugin = new ProgressBarPlugin();

const env = process.env.NODE_ENV || 'development';

console.log(`mode = ${env}`);

const json = JSON.stringify({
  buildDate: new Date().getTime(),
});
const definePluginConfig = {
  'process.env': {
    // SERVERURL:
    SERVER_URL: JSON.stringify(env === 'development' ? 'http://192.100.200.208:7001/' : '/'),
    JSON_BUILD: JSON.stringify(json),
  },
};

const plugins = [
  new webpack.optimize.OccurrenceOrderPlugin(true),
  new webpack.DefinePlugin(definePluginConfig),
  htmlPlugin,
  //    copyConfig,
  progressBarPlugin,
  new CopyWebpackPlugin([
    {
      from: './assets',
      to: './assets',
    },
  ]),
];

const optimization = {};
if (env === 'production') {
  optimization.minimize = true;
  optimization.namedModules = false;
  optimization.namedChunks = false;
  optimization.mangleWasmImports = true;
  optimization.moduleIds = 'hashed';
  optimization.minimizer = [
    new UglifyJsPlugin({
      uglifyOptions: {
        output: {
          comments: false,
        },
        minify: {},
        compress: {
          booleans: true,
          // ...
        },
      },
    }),
  ];
}

module.exports = {
  output: {
    path: path.resolve(__dirname, '.', 'public'),
    filename: 'bundled.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
            },
          },
        ],
      },
    ],
  },
  plugins,
  optimization,
};