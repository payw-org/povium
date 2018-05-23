const path = require('path');
const webpack = require('webpack');

module.exports = {
	mode: "production",
	entry: {
		'povium': [
			path.resolve(__dirname, 'public_html/js/povium.js')
		]
	},
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'public_html/js')
	},
	resolve: {
		alias: {
			jquery: "./public_html/global-inclusion/js/lib/jquery.min.js"
		}
	},
	plugins: [
		new webpack.ProvidePlugin({
			$: path.resolve(__dirname, 'public_html/global-inclusion/js/lib/jquery.min.js'),
			jQuery: path.resolve(__dirname, 'public_html/global-inclusion/js/lib/jquery.min.js'),
			Vue: path.resolve(__dirname, 'public_html/global-inclusion/js/lib/vue.js')
		})
	],
	module: {
		rules: [{
			test: /\.less$/,
			loader: 'less-loader' // compile LESS to CSS
		}]
	}
}
