
module.exports = {
  context: `${__dirname}/client`,
  entry: [
    "babel-polyfill",
    "uuid",
    "./index.jsx"
  ],
  output: {
    filename: "bundle.js",
    path: `${__dirname}/public`
  },
  debug: true,
  module: {
    loaders: [
      {
        loader: "babel-loader",
        test: /\.jsx?$/,
        include: `${__dirname}/client`,
        query: {presets: ["es2015", "react", "stage-2"]}
      }
    ]
  }
}
