const path = require('path')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { getEnvVars } = require('./utils.js')

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
        includePaths: [path.resolve('.'), path.resolve('./src/client/styles')],
    },
}

const config = {
    entry: {
        app: ['@babel/polyfill', '@ieremeev/boilerplate/dist/setup.js', './src/client/js/app.js'],
    },
    output: {
        path: currentDir + '/build',
        filename: 'app.[hash].bundle.js',
        chunkFilename: '[id].app.[chunkhash].bundle.js',
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: input => /\.(css|scss)$/.test(input) && !/\.module\.(css|scss)$/.test(input),
                use: [
                    { loader: MiniCssExtractPlugin.loader },
                    { loader: 'css-loader', options: { minimize: true } },
                    postcssLoader,
                    sassLoader,
                ],
            },
            {
                test: /\.module\.(css|scss)$/,
                use: [
                    { loader: MiniCssExtractPlugin.loader },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            importLoaders: 1,
                            localIdentName: '[local]__[hash:base64:5]',
                            minimize: true,
                        },
                    },
                    postcssLoader,
                    sassLoader,
                ],
            },
            {
                test: /\.less$/,
                use: [
                    { loader: MiniCssExtractPlugin.loader },
                    { loader: 'css-loader', options: { minimize: true } },
                    postcssLoader,
                    'less-loader',
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
        new CleanWebpackPlugin(['build'], { root: currentDir, verbose: false }),

        // Pass env variables to the webpack
        new webpack.DefinePlugin({
            ...getEnvVars(),
            'process.env.NODE_ENV': JSON.stringify('production'),
        }),

        // Generate an external css file with a hash in the filename
        new MiniCssExtractPlugin({ filename: '[name].[contenthash].css' }),

        new HtmlWebpackPlugin({
            template: 'src/client/js/index.ejs',
            inject: true,
        }),
    ],
    resolve: {
        modules: ['node_modules', path.resolve('./src'), path.resolve('./node_modules')],
        alias: {
            // Use this libraries always from this location
            react: path.resolve('./node_modules/react'),
            'react-dom': path.resolve('./node_modules/react-dom'),
        },
    },
    devtool: process.env.ANALYZE_BUNDLE ? false : 'source-map',
    optimization: {
        noEmitOnErrors: true,
        minimizer: [
            new UglifyJsPlugin({
                sourceMap: true,
                uglifyOptions: {
                    compress: {
                        // Look here for more options: https://github.com/mishoo/UglifyJS2#usage
                        warnings: false,
                    },
                    mangle: {
                        keep_classnames: true,
                        keep_fnames: true,
                    },
                },
            }),
        ],
    },
}

// if (process.env.ANALYZE_BUNDLE) {
//     config.plugins.push(new BundleAnalyzerPlugin({ defaultSizes: 'gzip' }))
// }

module.exports = config
