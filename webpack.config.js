let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

let glob = require('glob');
let PurifyCSSPlugin = require('purifycss-webpack');
module.exports = {
    // entry: ['./src/js/main.js','./src/js/user.js'], // 单个活多个打包成一个
    // 多入口，对应多出口
    entry: {
        style: './src/js/style.js',
        user: './src/js/user.js',
        about: './src/js/about.js'
    },
    output: { // 出口文件
        // filename: 'boundle.[hash:6].js', // 加上hash值
        filename: '[name].js', // 名称和入口名称一一对应
        path: path.resolve(__dirname, 'dist'),
        publicPath: 'http://127.0.0.1:8080/' // 必须配置成本机的ip和端口号
    },
    module: { // 模块依赖
        rules: [
            // less和css只能有一类样式文件存在，不能同时出现，不然打包后，less文件会吧css文件覆盖掉
            {
                test: /\.css$/,
                use: ExtractTextWebpackPlugin.extract({
                    fallback:'style-loader',
                    use: [
                        {loader: 'css-loader'},
                        {loader: 'postcss-loader'}
                    ]
                })
                /*
                这样写方便配置参数
                use: [
                    {loader: 'style-loader'},
                    {loader: 'css-loader'}
                ]*/
            },
            {
                test: /\.less$/,
                use: ExtractTextWebpackPlugin.extract({
                    fallback:'style-loader',
                    use: [
                        {loader: 'css-loader'},
                        {loader: 'less-loader'}
                    ]
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
            },
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude:/node_modules/
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
        }),
        new ExtractTextWebpackPlugin('css/index.css'), // 代码分离后的路径
        new PurifyCSSPlugin({
            paths: glob.sync(path.join(__dirname,'src/*.html'))
        })
    ],
    devServer: { // 本地服务器配置项
        contentBase: path.resolve(__dirname, 'dist'),
        host: 'localhost',
        port: 8080,
        // open: true, // 自动打开默认浏览器
        compress: true
    }
};