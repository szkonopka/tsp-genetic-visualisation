const UglifyPlugin = require('uglifyjs-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const path = require('path');

module.exports = {
	watch: true,
	entry: {
		"bundle.min.js": "./src/js/app.js",
		"style.min.js": "./src/sass/style.sass"
	},
	output: {
		path: path.resolve(__dirname, 'dist/assets'),
		filename: '[name]',
		publicPath: '/dist/assets'
	},
	watch: true,
	devtool: "source-map",
	module: {
		rules: [
			{
				test: /\.js$/,
				include: [
					path.resolve(__dirname, 'src')
				],
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: "babel-loader",
					options: {
						"presets": [
							["env", {
								"targets": {
									"browsers": ["last 2 versions", "safari >= 7"]
								}
							}]
						]
					}
				}
			},
			{
				test: /\.css$/,
				use: [ 'style-loader', 'css-loader' ]
			},
			{
				test: /\.(scss|sass)$/,
				use: [ 'style-loader', 'css-loader', 'sass-loader' ]
			}
		]
	},
	performance: {
		hints: false
	},
	plugins: [
		new UglifyPlugin({
			sourceMap: true
		}),
		new OpenBrowserPlugin({
			url: 'http://localhost:8080'
		})
	]
}
