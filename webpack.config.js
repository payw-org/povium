var WebpackBuildNotifierPlugin = require('webpack-build-notifier');

module.exports = {

	entry: {

		main: [
		'./resources/assets/js/globalscript',
		'./resources/assets/js/globalnav',
		'./resources/assets/js/home'
		],

		login: [
			'./resources/assets/js/login'
		],
		
		register: [
			'./resources/assets/js/register'
		],

		editor: [
			'./resources/assets/js/editor/main'
		]

	},

	mode: 'none',

	devtool: 'source-map',

	output : {

		path: __dirname + '/public_html/build/js',
		filename: '[name].built.js'
		
	},

	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
					presets: ['env']
					}
				}
			}
		]
	},

	plugins: [
		new WebpackBuildNotifierPlugin({
			title: "Webpack"
		})
	]

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