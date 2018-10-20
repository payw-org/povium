module.exports = {

	entry: {

		main: [
			'./resources/assets/js/index'
		],

		login: [
			'./resources/assets/js/login'
		],

		register: [
			'./resources/assets/js/register'
		],

		editor: [
			'./resources/assets/js/editor/main'
		],

		"editor.new": [
			'./resources/assets/js/newEditor/main'
		]

	},

	mode: 'development',

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
