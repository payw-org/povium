module.exports = {

	entry: {
		povium: [
			'./resources/assets/js/index'
		],
		"editor.new": [
			'./resources/assets/js/newEditor/main.ts'
		]
	},

	mode: 'development',
	devtool: 'source-map',
	output : {
		path: __dirname + '/public_html/build/js',
		filename: '[name].built.js'
	},

	resolve: {
		extensions: [ '.js', '.ts' ]
	},

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
