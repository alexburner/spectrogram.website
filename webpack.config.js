const path	= require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
module.exports = {

	entry: './src/index.tsx',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist'),
	},

	// Enable sourcemaps for debugging webpack's output.
	devtool: 'cheap-module-source-map',

	resolve: {
		// Add '.ts' and '.tsx' as resolvable extensions.
		extensions: ['.ts', '.tsx', '.js', '.json'],
		// Add node_modules and project directory for absolute paths
		modules: [
	        path.resolve(__dirname),
	        'node_modules'
	    ],
	},

	module: {
		rules: [
			// All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
			{ test: /\.tsx?$/, loader: 'awesome-typescript-loader' },

			// All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
			{ enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
		]
	},

	plugins: [
		new CopyWebpackPlugin([
			{ from: 'src/style.css', to: 'assets/' },
			{ from: 'node_modules/react/dist/react.js', to: 'vendor/' },
			{ from: 'node_modules/react-dom/dist/react-dom.js', to: 'vendor/' },
		]),
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: 'src/index.html',
		}),
		new HtmlWebpackIncludeAssetsPlugin({
			assets: [
				'assets/style.css',
				'vendor/react.js',
				'vendor/react-dom.js',
			],
			append: false, // prepend
		})
	],

	// When importing a module whose path matches one of the following, just
	// assume a corresponding global variable exists and use that instead.
	// This is important because it allows us to avoid bundling all of our
	// dependencies, which allows browsers to cache those libraries between builds.
	externals: {
		'react': 'React',
		'react-dom': 'ReactDOM'
	},

};
