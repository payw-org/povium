module.exports = {

	entry: './public_html/src/js/index.js',

	mode: 'none',

	module: {
		rules: [{
			test: /\.scss$/,
			use: [
				{
					loader: "sass-loader",
					options: {
						outputStyle: "expanded"
					}
				}
			]
		}]
	}
}

module.exports = [{  
name: 'js',
entry: {
	main: [
	'./src/index'
	]
},
...
}, {
name: 'css',
entry: {
	styles: [
		'./src/stylesheets/main.scss'
	]
},
...
}]