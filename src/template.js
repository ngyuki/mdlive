const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

export default function template() {

    const content = fs.readFileSync(path.resolve(__dirname, '../web/index.html'));

    const assets = {
        css: [
            'node_modules/github-markdown-css/github-markdown.css',
            'node_modules/highlight.js/styles/github-gist.css',
            'web/main.css',
        ],
        js: [
            'node_modules/socket.io-client/dist/socket.io.slim.js',
            'web/main.js',
        ],
    };

    const data = {};
    for (let key of Object.keys(assets)) {
        const bufs = [];
        for (let fn of assets[key]) {
            bufs.push(fs.readFileSync(path.resolve(__dirname, '..', fn)));
            bufs.push(Buffer.from("\n"));
        }
        data[key] = Buffer.concat(bufs).toString('base64');
    }

    return ejs.render(content.toString(), data);
};

