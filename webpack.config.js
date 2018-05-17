const path = require('path');
const webpack = require('webpack');

module.exports = {
	mode: "production",
	entry: {
		'povium': [
			path.resolve(__dirname, 'public_html/js/index.js')
		]
	},
	output: {
		filename: '[name].js',
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
	]
}
