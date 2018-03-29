import fs from 'fs'
import path from 'path'
import webpack from 'webpack'
import autoprefixer from 'autoprefixer'
import WebpackNotifierPlugin from 'webpack-notifier'
import CleanWebpackPlugin from 'clean-webpack-plugin'
import portFinderSync from 'portfinder-sync'
import _includes from 'lodash/includes'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import DuplicatePackageCheckerPlugin from 'duplicate-package-checker-webpack-plugin'

const currentDir = path.resolve(process.cwd())
const devServerHost = 'localhost'
const devServerPort = portFinderSync.getPort(9000)
const isDevServer = process.argv.find(v => _includes(v, 'webpack-dev-server'))

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
        includePaths: [path.resolve('.'), path.resolve('./src/client/styles')],
    },
}

const config = {
    entry: {
        app: ['babel-polyfill', '@ieremeev/boilerplate/es/setup.js', './src/client/js/index.js'],
    },
    output: {
        path: currentDir + '/build/js',
        filename: 'app.[hash].bundle.js',
        chunkFilename: '[id].app.[chunkhash].bundle.js',
    },
    module: {
        rules: [
            {
                test: input => /\.(css|scss)$/.test(input) && !/\.module\.(css|scss)$/.test(input),
                use: ['style-loader', 'css-loader', postcssLoader, sassLoader],
            },
            {
                test: /\.module\.(css|scss)$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            modules: true,
                            localIdentName: '[name]__[local]___[hash:base64:5]',
                        },
                    },
                    postcssLoader,
                    sassLoader,
                ],
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
                        presets: ['ieremeev'],
                    },
                },
            },
        ],
    },
    plugins: [
        // Clean build folder
        new CleanWebpackPlugin(['build/js'], { root: currentDir, verbose: false }),

        // Don't create bundle file if there are errors
        new webpack.NoEmitOnErrorsPlugin(),

        // Let modules know about your environment
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
            'process.env.NODE_DEBUG': '"' + process.env.NODE_DEBUG + '"',
            ...(isDevServer && {
                'process.env.WEBPACK_PUBLIC_PATH': `"https://${devServerHost}:${devServerPort}/"`,
            }),
        }),

        new webpack.optimize.AggressiveMergingPlugin({ minSizeReduce: 1.5 }),

        // Remove all moment locals except english ones
        new webpack.ContextReplacementPlugin(/node_modules\/moment\/locale/, /en/),
    ],
    resolve: {
        modules: [
            'node_modules',
            path.resolve('./'),
            path.resolve('./src/client'),
            path.resolve('./node_modules'),
        ],
        alias: {
            // Use this libraries always from this location
            react: path.resolve('./node_modules/react'),
            'react-dom': path.resolve('./node_modules/react-dom'),
        },
    },
    devtool: process.env.ANALYZE_BUNDLE ? false : 'cheap-module-eval-source-map',
    devServer: {
        contentBase: false,
        host: devServerHost,
        port: devServerPort,
        clientLogLevel: 'none',
        hot: false,
        overlay: true,
        https: true,
        stats: {
            all: false,
            timings: true,
            chunks: true,
            errors: true,
            warnings: true,
        },
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    },
}

if (isDevServer) {
    config.plugins.push(
        // Show notifications
        new WebpackNotifierPlugin()
    )
    config.plugins.push(
        // Show duplicate 3C packages which are not different major versions
        new DuplicatePackageCheckerPlugin({
            verbose: true,
            emitError: false,
            showHelp: false,
            strict: false,
            // exclude(instance) {
            //     return !/^cccisd-/.test(instance.name) || !/^\.\/~\//.test(instance.path)
            // },
        })
    )
} else if (process.env.ANALYZE_BUNDLE) {
    config.plugins.push(new BundleAnalyzerPlugin())
} else if (process.env.ANALYZE_DUPLICATES) {
    config.plugins.push(
        new DuplicatePackageCheckerPlugin({
            verbose: true,
            emitError: false,
            showHelp: false,
            strict: true,
        })
    )
}

export default config
