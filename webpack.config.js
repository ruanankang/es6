module.exports = {
  entry: './app.js', // 项目入口文件
  output: {
    filename: './dist/bundle.js'
  },
  module: {
    rules: [{
      test: /\.js$/,
      use: [{
        loader: 'babel-loader'
      }]
    }]
  },
  mode: 'development'
}