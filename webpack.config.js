const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const glob = require("glob");
const path = require("path");
const outputDirectory = "dist";

var config = {
  entry: [
    "./src/client/js/index.js",
    "babel-polyfill",
    "./src/client/styles/scss/main.scss"
  ],
  output: {
    path: __dirname + "/dist",
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.js?$/,
        exclude: [/node_modules/],
        loader: "eslint-loader",
        options: {
          fix: true
        }
      },
      {
        test: /\.js?$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["env", "stage-0"]
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: "style-loader" // creates style nodes from JS strings
          },
          {
            loader: "css-loader" // translates CSS into CommonJS
          },
          {
            loader: "sass-loader", // compiles Sass to CSS'
            options: {
              includePaths: glob
                .sync("node_modules")
                .map(d => path.join(__dirname, d))
            }
          }
        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg|jpg)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "img/",
              publicPath: "img/"
            }
          }
        ]
      }
    ]
  },
  devServer: {
    port: 3000,
    open: true,
    proxy: {
      "/api/**": {
        target: "http://localhost:9000",
        secure: false,
        changeOrigin: true
      }
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.$": "jquery",
      "window.jQuery": "jquery",
      Waves: "node-waves"
    }),
    new HtmlWebpackPlugin({
      template: "./index.html"
    }),
    new CleanWebpackPlugin([outputDirectory])
  ],
  devtool: "source-map"
};
config.node = { fs: "empty" };
module.exports = config;
