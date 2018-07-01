module.exports = {

	entry: [
		'./resources/assets/js/globalscript',
		'./resources/assets/js/globalnav',
		'./resources/assets/js/home',
		'./resources/assets/js/login',
		'./resources/assets/js/register',
	],

	mode: 'none',

	output : {
		path: __dirname + '/public_html/build/js',
		filename: 'povium.js'
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
	}

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