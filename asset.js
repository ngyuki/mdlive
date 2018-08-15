const fs = require('fs');
const path = require('path');

const assets = {
    'web/lib//github-markdown.css': 'node_modules/github-markdown-css/github-markdown.css',
    'web/lib//github-gist.css': 'node_modules/highlight.js/styles/github-gist.css',
    'web/lib//socket.io.slim.js': 'node_modules/socket.io-client/dist/socket.io.slim.js',
    'web/lib//jquery.min.js': 'node_modules/jquery/dist/jquery.min.js',
};

Object.keys(assets).forEach((key)=>{
    fs.copyFileSync(
        path.resolve(__dirname, assets[key]),
        path.resolve(__dirname, key)
    );
});
