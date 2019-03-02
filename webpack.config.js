const MiniCssExtractPlugin = require("mini-css-extract-plugin")

module.exports = {

	entry: {
		povium: [
			'./resources/assets/js/index.js'
		],
		"editor.new": [
			'./resources/assets/js/newEditor/main.ts'
		]
	},

	mode: 'development',
	devtool: 'inline-source-map',

	output : {
		path: __dirname + '/public_html/build/js',
		filename: '[name].built.js'
	},

	resolve: {
		extensions: [ '.js', '.ts' ]
	},

	plugins: [
		new MiniCssExtractPlugin({
			filename: "../css/[name].built.css"
		})
	],

	module: {
		rules: [
			{
				test: [/\.tsx?$/],
				exclude: /(node_modules|bower_components)/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-env']
						}
					},
					'ts-loader'
				]
			},
			{
				test: [/\.js$/],
				exclude: /(node_modules|bower_components)/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-env']
						}
					},
					'ts-loader'
				]
			},
			{
				test: /\.less$/,
				use: [
					'style-loader',
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							plugins: () => [
								require('autoprefixer')
								({
									'browsers': ['> 1%', 'last 2 versions']
								})
							]
						}
					},
					'less-loader'
				]
			},
			{
				test: /\.scss$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader
					},
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							plugins: () => [
								require('autoprefixer')
								({
									'browsers': ['> 1%', 'last 2 versions']
								})
							]
						}
					},
					'sass-loader'
				]
			}
		]
	},

}

// examples

// {
// 	entry: ['./index.js', './script.js'],

// 	output: {
// 		path: '/dist',
// 		filename: 'bundle.js'
// 	}
// }

// {
// 	entry: {
// 		"indexEntry": './index.js',
// 		"profileEntry": './profile.js'
// 	},

// 	output: {
// 		path: '/dist',
// 		filename: '[name].js'
// 	}
// }
