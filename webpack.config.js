var path = require("path");

module.exports = {
  context: path.join(__dirname, "/app"),
  entry: {
    application:["./src/app.js"],
    tests:["./test/testone.js"]
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
    library: "Application",
    libraryTarget: "umd",
    publicPath: ""
  },
  resolve: {
    alias: {
      jquery: "jquery-2.0.3",
      mocha: "mocha"
    }
  },
  devtool: 'source-map',
  plugins: [],
  loaders: [
            { test: /\.coffee$/, loader: "coffee" },
            { test: /\.css$/, loader: "style!css" }
        ]
};
