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
				loaders: ['babel-loader', 'ts-loader']
			},
			{
				test: [/\.js$/],
				exclude: /(node_modules|bower_components)/,
				loaders: ['babel-loader']
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
