const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");

const isDev = 'development';


module.exports = {
    mode: isDev,
    context: path.resolve(__dirname, 'src'),
    entry: {
        menu: './menu.ts',
        game: './game.ts',
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: isDev === 'development' ? `[name].bundle.js` : `[contenthash].bundle.js`,
    },
    devServer: {
        port: 3000
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
    },
    resolve: {
        extensions: ['.js', '.ts']
    },
    module: {
        rules: [{
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ]
            },
            {
                test: /\.svg$/,
                loader: 'svg-inline-loader'
            },
            {
                test: /\.(png|jpg|mp3)$/,
                dependency: {
                    not: ['url']
                },
                type: 'asset/resource',
                generator: {
                    filename: 'static/[hash][ext][query]'
                }
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            filename: 'index.html',
            chunks: ['game']
        }),
        new HtmlWebpackPlugin({
            filename: 'menu.html',
            template: './menu.html',
            chunks: ['menu']
        }),
        new MiniCssExtractPlugin(),
        new FaviconsWebpackPlugin({
            logo: './favicon.png'
        })
    ]
};