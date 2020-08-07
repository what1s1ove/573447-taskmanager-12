const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/main.ts",
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "public/js"),
  },
  devServer: {
    contentBase: path.join(__dirname, "public"),
    hot: true,
    port: 1337,
    watchContentBase: true,
  },
  resolve: {
    extensions: [".js", ".ts"],
    alias: {
      "~": path.resolve(__dirname, "src/"),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  devtool: "source-map",
};
