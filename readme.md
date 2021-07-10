# 介绍

这是一个简单的react，运用了react的基本功能来实现了虚拟dom及替换的功能

## 实现过程

### 配置webpack和Babel
使用如下命令安装webpack和webpack-cli
```bash
npm install webpack webpack-cli --save-dev
```
建立package.json文件在里面添加命令
```bash
"scripts": {
  "build": "webpack --mode production"
}
```

安装Babel
```bash
npm install @babel/core babel-loader @babel/preset-env @babel/preset-react --save-dev
```
建立.babelrc文件，写入下列代码，告知babel-core在转换时使用下列插件（作用分别为：将js编译为ES5、将JSX等编译为js）
```bash
{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}
```

创建webpack.config.js
```bash
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    index: './src/index.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin()
  ],
  output: {
    filename: '[name].[hash:5].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist'
  }
}
```
根据需要，安装html-webpack-plugin、webpack-dev-server，并修改package.json
```bash
npm install --save-dev html-webpack-plugin webpack-dev-server
```
package.json
```bash
{
  ...
  "scripts": {
    "build": "webpack --mode production",
    "start": "webpack serve" //之前为webpack-dev-server，由于webpack-cli和webpack-dev-server版本不相匹配会出现报错找不到文件，故修改
  },
  ...
}
```
