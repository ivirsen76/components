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
    entry: ['babel-polyfill', path.resolve(__dirname, 'src/index.js')],
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
                exclude: /(node_modules|packages\/es|packages\/src)/,
                use: ['babel-loader'],
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            mimetype: 'image/svg+xml',
                            name: '[name].[ext]',
                        },
                    },
                ],
            },
            {
                test: /\.(jpe?g|png|gif|ico)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                        },
                    },
                ],
            },
            {
                test: input => /\.(css|scss)$/.test(input) && !/\.module\.(css|scss)$/.test(input),
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            minimize: true,
                        },
                    },
                    postcssLoader,
                    sassLoader,
                ],
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
