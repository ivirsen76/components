const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const autoprefixer = require('autoprefixer')

const postcssLoader = {
    loader: 'postcss-loader',
    options: {
        plugins: () => [autoprefixer()],
    },
}

const sassLoader = {
    loader: 'sass-loader',
    options: {
        includePaths: [path.resolve(__dirname, 'src', 'scss')],
    },
}

module.exports = {
    mode: 'development',
    resolve: {
        mainFields: ['module', 'main'],
        extensions: ['*', '.js', '.jsx', '.json'],
    },
    devtool: 'cheap-module-eval-source-map',
    entry: [
        // must be first entry to properly set public path
        './src/webpack-public-path',
        path.resolve(__dirname, 'src/global.js'),
        '@babel/polyfill',
        path.resolve(__dirname, 'src/index.js'),
    ],
    target: 'web',
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        filename: 'bundle.js',
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
            __DEV__: true,
        }),
        new HtmlWebpackPlugin({
            template: 'src/index.ejs',
            inject: true,
        }),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                include: [path.resolve(__dirname, 'src'), /packages\/[^/]*\/examples/],
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            babelrc: false,
                            presets: [['ieremeev', { modules: false, onlyChrome: true }]],
                        },
                    },
                ],
            },
            {
                test: /\.(jpe?g|png|gif|ico|svg)$/i,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 5000,
                        name: '[name]-[hash].[ext]',
                    },
                },
            },
            {
                test: /\.(ttf|eot|woff|woff2)$/,
                use: ['file-loader'],
            },
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
        ],
    },
    devServer: {
        contentBase: false,
        host: 'localhost',
        port: 3000,
        clientLogLevel: 'none',
        hot: false,
        overlay: true,
        https: false,
        stats: {
            all: false,
            timings: true,
            chunks: true,
            errors: true,
            warnings: true,
        },
        historyApiFallback: true,
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    },
    optimization: {
        noEmitOnErrors: true,
    },
}
