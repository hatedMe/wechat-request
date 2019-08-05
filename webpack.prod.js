const webpack = require('webpack');
const path = require('path');

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
module.exports = {
	entry: './index.js',
	output: {
        libraryTarget: 'umd', 
        umdNamedDefine: true , 
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist')
	},
	devtool : 'source-map',
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				options: {
					presets: ['env'],
					plugins : 'transform-es2015-modules-commonjs'
				}
			}
		]
	},

	plugins: [
		new UglifyJSPlugin(),
		new webpack.BannerPlugin(`
			author : 7548764@qq.com
			github : https://github.com/hatedMe/wechat-request
			version : 2.2.0
		`)
	]
};
