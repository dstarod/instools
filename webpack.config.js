// https://webpack.github.io/docs/webpack-dev-server.html
let path = require('path');
// const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    devtool: 'cheap-module-source-map',  // https://webpack.js.org/configuration/devtool/
    entry: [
        './app/app.js'
    ],
    output: {
        path: path.resolve(__dirname, "static"),
        publicPath: "/assets/",
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loaders: ['babel-loader'],
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                })
            },
            // {
            //     // Including CSS into app with <style> tag
            //     test: /\.scss$/,
            //     loaders: ['style-loader', 'css-loader', 'sass-loader']
            // },
        ],
    },
    plugins: [
        new ExtractTextPlugin(
            {
                filename: 'style.css',
                disable: false,
                allChunks: true
            }
        )
    ]
};
