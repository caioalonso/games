const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "app.js",
    path: path.resolve(__dirname)
  },
  devServer: {
    contentBase: path.join(__dirname),
    compress: true,
    port: 3000
  }
};
