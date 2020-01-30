const path = require('path');

module.exports = {
    devtool: 'source-map',
    entry: './docs/transpiled/index.js',
    mode: 'production',
    optimization: {
        minimize: true
    },
    output: {
        filename: 'docs.min.js',
        path: path.resolve(__dirname, './docs/bundled')
    }
};
