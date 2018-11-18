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
    resolve: {
        mainFields: ['module', 'main'],
        extensions: ['*', '.js', '.jsx', '.json'],
    },
    devtool: 'source-map',
    entry: [
        path.resolve(__dirname, 'src/global.js'),
        'babel-polyfill',
        path.resolve(__dirname, 'src/index.js'),
    ],
    target: 'web',
    output: {
        path: path.resolve(__dirname, 'build'),
        publicPath: '/',
        filename: '[name].[chunkhash].js',
    },
    plugins: [
        // Tells React to build in prod mode. https://facebook.github.io/react/downloads.html
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
            __DEV__: false,
        }),

        // Generate HTML file that contains references to generated bundles.
        new HtmlWebpackPlugin({
            template: 'src/index.ejs',
            favicon: 'src/favicon.ico',
            minify: {
                removeComments: true,
                collapseWhitespace: true,
            },
            inject: true,
        }),

        // Minify JS
        new webpack.optimize.UglifyJsPlugin({ sourceMap: true }),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                include: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'packages')],
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            babelrc: false,
                            presets: [['ieremeev', { modules: false }]],
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
                            localIdentName: '[hash:base64:5]',
                        },
                    },
                    postcssLoader,
                    sassLoader,
                ],
            },
        ],
    },
}
