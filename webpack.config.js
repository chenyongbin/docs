const path = require("path");
const HtmlPlugin = require("html-webpack-plugin");
const UglifyjsPlugin = require("uglifyjs-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const projectName = process.env.npm_package_name,
  projectVersion = process.env.npm_package_version,
  envName = process.env.NODE_ENV,
  isDevelopment = envName === "development";

console.log("================================");
console.log(`项目名称：${projectName}`);
console.log(`项目版本：${projectVersion}`);
console.log(`当前环境：${envName}`);
console.log("================================");
console.log("\n");

const webpackConfig = {
  mode: envName,
  context: path.resolve(process.cwd(), "app", "src"),
  entry: "./index.js",
  output: {
    path: isDevelopment
      ? path.resolve(__dirname, "app", "dest")
      : path.resolve(__dirname, "assets"),
    filename: isDevelopment ? "main.bundle.js" : "main.[chunkhash:8].js"
  },
  devtool: isDevelopment ? "inline-source-map" : "source-map",
  module: {
    rules: [
      {
        test: /\.(sa|sc)ss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env", "@babel/preset-react"]
        }
      }
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        verndor: {
          name: "vendor",
          test: /[\\/]node_modules[\\/]/,
          chunks: "all",
          filename: isDevelopment
            ? "vendor.bundle.js"
            : "vendor.[chunkhash:8].js"
        }
      }
    }
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: isDevelopment ? "style.css" : "style.[chunkhash:8].css"
    }),
    new HtmlPlugin({
      template: "template.html",
      filename: isDevelopment
        ? path.join(__dirname, "app", "dest", "index.html")
        : path.join(__dirname, "index.html"),
      chunks: ["main", "vendor"]
    })
  ]
};

if (isDevelopment) {
  webpackConfig.devServer = {
    contentBase: path.resolve(__dirname, "app", "dest"),
    writeToDisk: true,
    watchContentBase: true,
    stats: "minimal"
  };
} else {
  webpackConfig.plugins.push(new CleanWebpackPlugin());
  webpackConfig.plugins.push(new UglifyjsPlugin({ sourceMap: true }));
}

module.exports = webpackConfig;
