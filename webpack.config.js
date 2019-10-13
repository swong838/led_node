var webpack = require('webpack');
var path = require('path');

var SRC_DIR = path.resolve(__dirname, './server/client/src');
var BUILD_DIR = path.resolve(__dirname, './server/client/build/static');

module.exports = {
    mode: "development",
    entry: SRC_DIR + '/app.js',
    output: {
        path: BUILD_DIR,
        filename: 'app.js'
    },
    module: {
        rules: [
            {
                test: /\.jsx?/,
                exclude: /node_modules/,
                use: ['babel-loader']
            }
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.jsx']
    },
};
