import fs from 'fs'
import path from 'path'
import webpack from 'webpack'
import autoprefixer from 'autoprefixer'
import CleanWebpackPlugin from 'clean-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

const currentDir = path.resolve(process.cwd())

const postcssLoader = {
    loader: 'postcss-loader',
    options: {
        ident: 'postcss',
        plugins: loader => [autoprefixer()],
    },
}

const sassLoader = {
    loader: 'sass-loader',
    options: {
        includePaths: [path.resolve('.'), path.resolve('./resources/assets/styles')],
    },
}

const config = {
    entry: {
        app: ['babel-polyfill', 'cccisd-boilerplate/es/setup.js', './resources/assets/js/app.js'],
    },
    output: {
        path: currentDir + '/public/build/js',
        filename: 'app.[hash].bundle.js',
        chunkFilename: '[id].app.[chunkhash].bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true,
                                importLoaders: 1,
                                localIdentName: '[hash:base64:5]',
                                minimize: true,
                            },
                        },
                        postcssLoader,
                        sassLoader,
                    ],
                }),
            },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: { minimize: true },
                        },
                        postcssLoader,
                        'less-loader',
                    ],
                }),
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: { minimize: true },
                        },
                        postcssLoader,
                        sassLoader,
                    ],
                }),
            },
            {
                test: /\.(jpg|png|gif|svg)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: '[name]-[hash].[ext]',
                    },
                },
            },
            {
                test: /\.(ttf|eot|woff|woff2)$/,
                use: ['file-loader'],
            },
            {
                test: /\.json$/,
                use: ['json-loader'],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        babelrc: false,
                        presets: ['cccisd'],
                    },
                },
            },
        ],
    },
    plugins: [
        // Clean build folder
        new CleanWebpackPlugin(['public/build/js'], { root: currentDir, verbose: false }),

        // Don't create bundle file if there are errors
        new webpack.NoEmitOnErrorsPlugin(),

        // Let modules know about your environment
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
            'process.env.NODE_DEBUG': '"' + process.env.NODE_DEBUG + '"',
        }),

        // Generate an external css file with a hash in the filename
        new ExtractTextPlugin('[name].[contenthash].css'),

        new webpack.optimize.AggressiveMergingPlugin({ minSizeReduce: 1.5 }),

        // Remove all moment locals except english ones
        new webpack.ContextReplacementPlugin(/node_modules\/moment\/locale/, /en/),

        // Minify bundle file
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                // Look here for more options: https://github.com/mishoo/UglifyJS2#usage
                warnings: false,
            },
        }),

        // Save app bundle filename in temp file
        // eslint-disable-next-line func-names, space-before-function-paren
        function() {
            this.plugin('done', stats => {
                const jsBundleFilename = stats.toJson().assetsByChunkName.app[0]
                const cssBundleFilename = stats.toJson().assetsByChunkName.app[1]

                // Write js bundle
                ;(() => {
                    const filename = path.join(currentDir, 'storage', 'app', 'js.bundle.filename')
                    const fileExists = fs.existsSync(filename)
                    fs.writeFileSync(filename, jsBundleFilename)
                    if (!fileExists) {
                        fs.chmodSync(filename, 0o777)
                    }
                })()

                // Write css bundle
                ;(() => {
                    const filename = path.join(currentDir, 'storage', 'app', 'css.bundle.filename')
                    const fileExists = fs.existsSync(filename)
                    fs.writeFileSync(filename, cssBundleFilename)
                    if (!fileExists) {
                        fs.chmodSync(filename, 0o777)
                    }
                })()
            })
        },
    ],
    resolve: {
        modules: [
            'node_modules',
            path.resolve('./'),
            path.resolve('./resources/assets'),
            path.resolve('./node_modules'),
        ],
        alias: {
            // Use this libraries always from this location
            react: path.resolve('./node_modules/react'),
            'react-dom': path.resolve('./node_modules/react-dom'),
        },
    },
    devtool: process.env.ANALYZE_BUNDLE ? false : 'source-map',
}

if (process.env.ANALYZE_BUNDLE) {
    config.plugins.push(new BundleAnalyzerPlugin({ defaultSizes: 'gzip' }))
}

export default config
