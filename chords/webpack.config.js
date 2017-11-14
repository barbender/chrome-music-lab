/**
 * Copyright 2016 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var webpack = require("webpack");
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const DEBUG = process.env.NODE_ENV !== 'production';

var PROD = JSON.parse(process.env.PROD_ENV || '0');
console .log('production', PROD);

const extractCss = new ExtractTextPlugin({
    filename: '[name].css',
    disable: DEBUG
});

module.exports = {
	"context": __dirname,
	entry: {
		"Main": "./app/Main.js"
	},
	output: {
		filename: "./build/[name].js",
		chunkFilename: "./build/[id].js",
		sourceMapFilename : "[file].map"
	},
	resolve: {
		modules: ["node_modules", "style", "third_party/Tone.js/", "app", "third_party/"]
	},
    plugins: PROD ?
        [
            extractCss,
            new webpack.optimize.UglifyJsPlugin({minimize: true})
        ] :
        [
            extractCss
        ],
	 module: {
		loaders: [
            {
                test: /\.scss$/,
                use: extractCss.extract({
                    use: [{
                        loader: "css-loader",
                        options: {
                            sourceMap: DEBUG
                        }
                    }, {
                        loader: "sass-loader",
                        options: {
                            sourceMap: DEBUG
                        }
                    }],
                    // use style-loader in development
                    fallback: "style-loader"
                })
            },
			{
				test: /\.json$/,
				loader: "json-loader"
			},
			{
				test: /\.(png|gif)$/,
				loader: "url-loader",
			}
		]
	},
};