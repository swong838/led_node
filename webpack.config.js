var webpack = require('webpack');
var path = require('path');

var SRC_DIR = path.resolve(__dirname, './src/frontend');
var BUILD_DIR = path.resolve(__dirname, './application/client/build/static');

module.exports = {
    mode: "development",
    entry: {
        cells: `${SRC_DIR}/cells.js`,
        settings: `${SRC_DIR}/settings.js`,
        testbed: `${SRC_DIR}/testbed.js`,
        wave: `${SRC_DIR}/wave.js`,
        remote: `${SRC_DIR}/remote.js`,
    },
    
    output: {
        path: BUILD_DIR,
        filename: '[name].js'
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
        extensions: ['*', '.js', '.jsx'],
        alias: {
            '%src': path.resolve(__dirname, 'src/'),
            '%frontend': path.resolve(__dirname, 'src/frontend/'),
            '%lib': path.resolve(__dirname, 'src/lib/'),
            '%effects': path.resolve(__dirname, 'src/effects/')
        }
    },
};
