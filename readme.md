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
    "start": "webpack serve" //之前为"webpack-dev-server"，由于webpack-cli和webpack-dev-server版本不相匹配会出现报错找不到文件，故修改
  },
  ...
}
```

## 建立index.js、react.js、react-dom.js

### Babel的编译过程是如何的？
在Babel的官网，点击试一试，输入下列代码，会得到新的一组代码：
输入
```bash
<div>
  <h1 id="app">hello</h1>
  <h2>world</h2> 
  <Div>1</Div>
</div>
```
输出
```bash
/*#__PURE__*/
React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
  id: "app"
}, "hello"), /*#__PURE__*/React.createElement("h2", null, "world"), /*#__PURE__*/React.createElement(Div, null, "1"));
```

### index.js
```bash

import React, {Component} from "./lib/react"
import ReactDOM from "./lib/react-dom"


function Menu(props) {
    return <h1>menu {props.title}</h1>
}

class App extends Component {  //让App继承Component，由于直接导入了Component，可以这么写；若导入的是import React from "./lib/react",则需写成class App extends React.Component
    constructor(props) {
        super(props)           //想使用this则要加上这一句，是js的规定，也有其它较麻烦方法可以实现同样效果

        this.states = {
            title: 'zaragto'
        }
    }

    handleClick() {
        this.setStates({
            title: 'change'
        })
    }


    render() {                  //用来建立一个虚拟DOM
        return (
            <div>
                <Menu title={this.states.title}></Menu>
                <h1>{ this.states.title}</h1>
                <p>{ this.props.id}</p>
                <span onClick={this.handleClick.bind(this)}>hello</span>
            </div>
        );
    }
}


ReactDOM.render((           //在body标签下插入这个App虚拟DOM
    <App id = "app">hello</App>  //运行时，这个App会被视作一个变量，调用前面定义好的App
), document.body)
```


### react.js
```bash
import {renderComponent} from "./react-dom.js";



function createElement(tag, attrs, ...children) {  //根据Babel的编译过程，可以解析成如此
    return {
        tag,
        attrs,
        children
    }
}

class Component {
    constructor(props) {
        this.props = props
        this.states = {}
    }

    setStates(newState) {
        Object.assign(this.states, newState)
        console.log('hello')
        renderComponent(this)
    }

}

# const React = {
#     createElement,
#     Component
# }


export {
    createElement,
    Component
}

export default {
    createElement,
    Component
}
```

### react-dom.js
```bash
import React from './react'


function setAttribute(node, attrs) {    //处理标签属性
    if(!attrs) return;
        for(let key in attrs) {
            if(key.startsWith('on')) {
                node[key.toLocaleLowerCase()] = attrs[key];
            } else if(key === 'style') {
                Object.assign(node.style, attrs[key]);
            } else {
                node[key] = attrs[key];
            }
        }
   }

function renderVdom(vdom, container) {   //把虚拟DOM插入container
  let node = createDomfromVdom(vdom)
  container.appendChild(node)

}


function createDomfromVdom(vdom) {      //根据Babel的编译，处理一般的标签和自定义标签
    let node
    if(typeof vdom === "string") {
        node = document.createTextNode(vdom)
        return node
    }
    if(typeof vdom === "object") {
        if(typeof vdom.tag === 'function') {
            let component = getComponent(vdom.tag, vdom.attrs)
            let vnode = component.render()
            node = createDomfromVdom(vnode)
            component.$root = node
        } else{
            node = document.createElement(vdom.tag)
            setAttribute(node, vdom.attrs)
            vdom.children.forEach(childrenVdom => renderVdom(childrenVdom, node))
        }

    }
    return node
}


function getComponent(constructor, attrs) {           //区分App和Menu，解决Menu里没有render方法
    if(constructor.prototype instanceof React.Component) {
        return new constructor(attrs)
    } else {
        let App = class extends React.Component {}
        App.prototype.render = function() {
            return constructor(attrs)
        }
        return new App(attrs)

    }
}

function renderComponent(component) {   //替换功能
    let vdom = component.render()
    let node = createDomfromVdom(vdom)
    if(component.$root) {
        component.$root.parentNode.replaceChild(node, component.$root)
    }
    console.log('render')
}

function render(vdom, container) {
    container.innerHTML = ''
    renderVdom(vdom, container)
}

const ReactDOM = {
    render(vdom, container) {
        container.innerHTML = ""
        render(vdom, container)
    },
    renderComponent
}

# export default ReactDOM

export {
    render,
    renderComponent,
    ReactDOM
}

export default {
    render,
    renderComponent,
    ReactDOM
}
```
