# webpack4.0
##webpack4.0配置学习

webpack是一款前端自动化构建工具，通过模块化打包运行，大大提高了前端工程师的工作效率，优化了前端代码。

本质上，webpack 是一个现代 JavaScript 应用程序的静态模块打包器(module bundler)。当 webpack 处理应用程序时，它会递归地构建一个依赖关系图(dependency graph)，其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个 bundle。

###一、快速开启一个简单的webpack工作流

#####1、新建一个文件夹webpack

#####2、进入文件夹，打开命令行，初始化node环境：

npm init

#####3、全局安装webpack，webpack4.X开始需要安装webpack-cli

cnpm i webpack webpack-cli

#####4、本地安装

cnpm i webpack webpack-cli -D

#####5、在根目录下新建src和dist两个文件夹，分别用于存放编辑文件和最后打包的文件

#####6、src下新建index.html和main.js文件

#####7、此时运行webpack，会默认将main.js打包到dist目录下生成一个main.json文件里对script快速命令行做一下配置：

`"scripts": {
    "build": "webpack"
  },
`

此时就开启了一个简单的webpack工作流，一般会在package

###二、配置入口，出口

在根目录下新建webpack.config.js文件，开始配置：

`module.exports = {

    entry: {}, // 入口文件
    output: {}, // 出口文件
    module: {}, // 模块依赖
    plugins: [], // 插件依赖
    devServer: {} // 本地服务器配置项
};`

这是最基本的结构，分为这五个大的部分

单个入口文件,打包成一个文件：

`let path = require('path');
module.exports = {

    entry: './src/js/main.js',
    output: { // 出口文件
        filename: 'boundle.js', // 不加hash值
        path: path.resolve('dist')
    }
};`

多个文件，打包成一个文件：

`let path = require('path');
module.exports = {

    entry: ['./src/js/main.js','./src/js/user.js'], // 单个活多个打包成一个
    output: { // 出口文件
        filename: 'boundle.[hash:4].js', // 加上4位hash值
        path: path.resolve('dist')
    }
};`

多入口对应多出口文件配置：

`let path = require('path');
module.exports = {

    // entry: ['./src/js/main.js','./src/js/user.js'], // 单个活多个打包成一个
    // 多入口，对应多出口
    entry: {
        main: './src/js/main.js',
        user: './src/js/user.js'
    },
    output: { // 出口文件
        // filename: 'boundle.[hash:6].js', // 加上hash值
        filename: '[name].js', // 名称和入口名称一一对应
        path: path.resolve('dist')
    }
};`

[name]的意思是根据入口文件的名称，打包成相同的名称，有几个入口文件，就可以打包出几个文件。
js上线的时候都是需要压缩的，webpack4.0已经给我们默认压缩了的，就不用像3.X一样去配置了。

html打包

在src目录下新建index.html，打包html文件需要安装一个插件：html-webpack-plugin

cnpm install html-webpack-plugin -D

`let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {

    // entry: ['./src/js/main.js','./src/js/user.js'], // 单个活多个打包成一个
    // 多入口，对应多出口
    entry: {
        main: './src/js/main.js',
        user: './src/js/user.js'
    },
    output: { // 出口文件
        // filename: 'boundle.[hash:6].js', // 加上hash值
        filename: '[name].js', // 名称和入口名称一一对应
        path: path.resolve(__dirname,'dist')
    },
    plugins: [ // 插件依赖
        new HtmlWebpackPlugin({
            minify: { // 压缩html并去掉属性的双引号
                removeAttributeQuotes:true
            },
            template:'./src/index.html', // 打包模板
            hash: true // 给引入的js添加hash值
        })
    ]
};`

现在就可以在浏览器中打开打包好的html文件了，不过这里可以安装一个服务器插件来开启热更新，随时浏览

cnpm i webpack-dev-server -D

在package.json里新增配置：

`"scripts": {
    "build": "webpack",
    "dev": "webpack-dev-server"
  },`

config.js里添加服务器相关配置：

`let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {

    // entry: ['./src/js/main.js','./src/js/user.js'], // 单个活多个打包成一个
    // 多入口，对应多出口
    entry: {
        main: './src/js/main.js',
        user: './src/js/user.js'
    },
    output: { // 出口文件
        // filename: 'boundle.[hash:6].js', // 加上hash值
        filename: '[name].js', // 名称和入口名称一一对应
        path: path.resolve(__dirname,'dist')
    },
    module: {}, // 模块依赖
    plugins: [ // 插件依赖
        new HtmlWebpackPlugin({
            minify: { // 压缩html并去掉属性的双引号
                removeAttributeQuotes:true
            },
            template:'./src/index.html', // 打包模板
            hash: true // 添加hash值
        })
    ],
    devServer: { // 本地服务器配置项
        contentBase: path.resolve(__dirname,'dist'),
        host: 'localhost',
        port: 8080,
        open: true, // 自动打开默认浏览器
        compress: true
    }
};`

此时运行npm run dev 即可开启本地服务器，地址为http://localhost:8080/

此时随便编辑一下某一个文件，都会自动打包，编译，并在浏览器中看到效果

css文件打包

对于前端页面css样式文件是肯定需要的，在src目录下新建css文件夹并新建main.css

body{
    color: red;
}
在mian.js里面引入样式

import '../css/main.css'
此时需要安装style-loader和css-loader两个模块

cnpm i css-loader style-loader -D

进入config.js添加配置项：

`let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {

    // entry: ['./src/js/main.js','./src/js/user.js'], // 单个活多个打包成一个
    // 多入口，对应多出口
    entry: {
        main: './src/js/main.js',
        user: './src/js/user.js'
    },
    output: { // 出口文件
        // filename: 'boundle.[hash:6].js', // 加上hash值
        filename: '[name].js', // 名称和入口名称一一对应
        path: path.resolve(__dirname, 'dist')
    },
    module: { // 模块依赖
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader','css-loader']
                /*
                这样写方便配置参数
                use: [
                    {loader: 'style-loader'},
                    {loader: 'css-loader'}
                ]*/
            }
        ]
    },
    plugins: [ // 插件依赖
        new HtmlWebpackPlugin({
            minify: { // 压缩html并去掉属性的双引号
                removeAttributeQuotes: true
            },
            template: './src/index.html', // 打包模板
            hash: true // 添加hash值
        })
    ],
    devServer: { // 本地服务器配置项
        contentBase: path.resolve(__dirname, 'dist'),
        host: 'localhost',
        port: 8080,
        open: true, // 自动打开默认浏览器
        compress: true
    }
};`

配置好后，重启一下服务，就ok了。

打包less文件

一般情况下我们会更喜欢用less编写样式，就需要安装对应的加载器

cnpm i less less-loader -D

然后配置loader

`rules: [

            {
                test: /\.css$/,
                use: ['style-loader','css-loader']
                /*
                这样写方便配置参数
                use: [
                    {loader: 'style-loader'},
                    {loader: 'css-loader'}
                ]*/
            },
            {
                test: /\.less$/,
                use: ['style-loader','css-loader','less-loader']
            }
        ]`

打包图片

css中的图片：

安装file-loader 和url-loader

cnpm i file-loader url-loader -D

配置文件：

`rules: [

            {
                test: /\.css$/,
                use: ['style-loader','css-loader']
                /*
                这样写方便配置参数
                use: [
                    {loader: 'style-loader'},
                    {loader: 'css-loader'}
                ]*/
            },
            {
                test: /\.less$/,
                use: ['style-loader','css-loader','less-loader']
            },
            {
                test: /\.(jpe?g|png|gif)/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 50000,
                        outputPath: 'images/'
                    }
                }]
            }
        ]`

其实url-loader封装了file-loader。url-loader不依赖于file-loader，即使用url-loader时，只需要安装url-loader即可，不需要安装file-loader，因为url-loader内置了file-loader。通过上面的介绍，我们可以看到，url-loader工作分两种情况：

1.文件大小小于limit参数，url-loader将会把文件转为DataURL（Base64格式）；

2.文件大小大于limit，url-loader会调用file-loader进行处理，参数也会直接传给file-loader。

css和less分离

当css很多的时候，就不可能还是把样式内嵌到js当中了，就需要分离出来，用link引入，这时就会用到extract-text-webpack-plugin

cnpm i extract-text-webpack-plugin@next -D

@next表示可以支持webpack4版本

config.js中引用一下

分离less

`rules: [

            {
                test: /\.less$/,
                use: ExtractTextWebpackPlugin.extract({
                    use: [
                        {loader: 'css-loader'},
                        {loader: 'less-loader'},
                    ],
                    fallback:'style-loader'
                }),
            },
            {
                test: /\.(jpe?g|png|gif)/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 50000,
                        outputPath: 'image/'
                    }
                }]
            },
            {
                test: /\.(htm|html)$/i,
                use: ['html-withimg-loader']
            }
        ]
    },`

分离css

`rules: [

            {
                test: /\.css$/,
                use: ExtractTextWebpackPlugin.extract({
                    use: 'css-loader',
                    fallback:'style-loader'
                })
                /*
                这样写方便配置参数
                use: [
                    {loader: 'style-loader'},
                    {loader: 'css-loader'}
                ]*/
            },
            {
                test: /\.(jpe?g|png|gif)/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 50000,
                        outputPath: 'image/'
                    }
                }]
            },
            {
                test: /\.(htm|html)$/i,
                use: ['html-withimg-loader']
            }
        ]
    },`

`let ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
plugins: [ // 插件依赖

        new HtmlWebpackPlugin({
            minify: { // 压缩html并去掉属性的双引号
                removeAttributeQuotes: true
            },
            template: './src/index.html', // 打包模板
            hash: true // 添加hash值
        }),
        new ExtractTextWebpackPlugin('css/index.css') // 代码分离后的路径
    ],`

重点来了，这里必须在output里面配置一下公共路径，不然打包后css里面的背景图片会找不到路径报错：

 `output: { // 出口文件

        // filename: 'boundle.[hash:6].js', // 加上hash值
        filename: '[name].js', // 名称和入口名称一一对应
        path: path.resolve(__dirname, 'dist'),
        publicPath: 'http://127.0.0.1:8080/' // 必须配置成本机的ip和端口号
    },`

还有个有意思的地方，如果每个js模块都引入一个css或者less文件，打包成对应的js后，后面js里引入的css样式会覆盖前面的，只能单独建立一个js模块用来转门引入样式表，这样打包分离后就不会被覆盖了

style.js:

`
import '../css/main.css'
import '../css/about.less'
import '../css/user.less'
`

html中的图片

html中的img标签导入的图片需要html-withimg-loader

cnpm i html-withimg-loader -D

添加模块：

`{
                test: /\.(htm|html)$/i,
                use: ['html-withimg-loader']
            }`

打包就ok啦！

自动处理css3前缀

pc端的css3样式兼容并不理想，需要添加不同的浏览器内核才能解析，postcss-loader就是用来干这事的

cnpm i postcss-loader autoprefixer(自动添加包) -D

安装好之后需要在webpack.config.js同级新建一个postcss.config.js:

`module.exports = {

    plugins: [
        require('autoprefixer')
    ]
};`

编写配置文件：

            `{
                test: /\.css$/,
                use: ExtractTextWebpackPlugin.extract({
                    fallback:'style-loader',
                    use: [
                        {loader: 'css-loader',options:{importLoaders: 1}},
                        'postcss-loader'
                    ]
                })
            }`
消除未使用的css

npm i -D purifycss-webpack purify-css

在webpack.config.js里引入

let glob = require('glob');

let PurifyCSSPlugin = require('purifycss-webpack');

plugins里配置：

`new PurifyCSSPlugin({

            paths: glob.sync(path.join(__dirname,'src/*.html'))
        })`
配置了paths路径，主要是需找html模板，purifycss根据这个配置会遍历你的文件，查找哪些css被使用了
此时打包就可以将样式里没有用到的css删除掉了。

转义es6

现在前端代码基本上已经到了es6语法的时代，但是很多浏览器多es6支持不好，还停留在es5的阶段，所以就必须用工具进行编译一下，babel可以做到。

cnpm i babel-core babel-loader babel-preset-es2015 babel-preset-react -D

在config.js同级目录新建.babelrc文件：

`{
  "presets": ["react","es2015"]
}`
配置文件：

`{
                test: /\.js$/,
                use: 'babel-loader',
                exclude:/node_modules/
            }`
或者：(官方推荐)

npm i babel-core babel-loader babel-preset-env babel-preset-stage-0 -D

.babelrc文件：

`{
    "presets": ["env", "stage-0"]   // 从右向左解析
}`
两种方法都是可以的
