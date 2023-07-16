const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = (env) => {
  return {
    mode: "development",
    devtool: "source-map",
    entry: "./src/index.tsx",
    output: {
      filename: "js/out.js",
      path: path.join(__dirname, "dist"),
    },
    devServer: {
      port: 1335,
      hot: true,
      open: true,
      historyApiFallback: true,
      proxy: {
        "/api": {
          target: "http://localhost:9999",
          pathRewrite: {
            "^/api": "",
          },
          changeOrigin: true,
        },
      },
    },
    resolve: {
      extensions: [".js", ".json", ".ts", ".jsx", ".tsx"],
      alias: {
        "@": path.resolve("./src"), // 路径别名
      },
    },
    module: {
      rules: [
        {
          test: /\.jsx$/,
          use: "babel-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: ["babel-loader"],
        },
        {
          test: /\.css?$/,
          exclude: /node_modules/,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.(png|svg|gif|jpe?g)$/,
          type: "asset",
          generator: {
            filename: "imgwhj/[name].[hash:4].[ext]",
          },
          parser: {
            dataUrlCondition: {
              maxSize: 50 * 1024,
            },
          },
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: "demo",
        meta: {
          viewport: "width=device-width",
        },
        template: "./public/index.html",
      }),
      new ForkTsCheckerWebpackPlugin(),
    ],
  };
};
