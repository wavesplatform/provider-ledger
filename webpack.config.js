const webpack = require("webpack");
const path = require('path');
const resolve = path.resolve;

const time = new Date().toLocaleDateString('ru', { hour: 'numeric', minute: 'numeric', second: 'numeric' });
const definePLugin = new webpack.DefinePlugin({
	VERSION: time,
});

// The shared npm publishing workflow uses Node.js >= 24.7.0:
// https://github.com/wavesplatform/publish-to-npm/blob/7d9462af686d83552d72097bf47a892e43d11f6e/.github/workflows/publish.yml
//
// Webpack 4 uses the legacy MD4 hashing algorithm, which is disabled by
// OpenSSL 3 in modern Node.js versions. Therefore, the `npm run build`
// command enables --openssl-legacy-provider until Webpack is upgraded.
module.exports = [
	{
		entry: './src/index.ts',
		mode: "production",
		module: {
			rules: [
				{
					test: /\.ts/,
					use: 'ts-loader',
					exclude: /node_modules/,
				},
				{
					test: /\.less$/,
					use: [
						// conf.mode === 'production' ? MiniCssExtractPlugin.loader : 
						{ loader: "style-loader" },
						{
							loader: "css-loader",
							options: {
								modules: true,
								localIdentName: '[folder]__[local]--[hash:base64:5]',
							}
						},
						{
							loader: "less-loader",
							options: { root: path.resolve(__dirname, './') }
						},
					]
				},
			],
		},
		resolve: {
			extensions: ['.tsx', '.ts', '.js'],
		},
		output: {
			libraryTarget: 'umd',
			globalObject: 'this',
			library: 'providerLedger',
			filename: 'provider-ledger.js',
			path: resolve(__dirname, 'dist'),
		}
	}
];
