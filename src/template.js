const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

function resolve(name) {
    return fs.readFileSync(path.resolve(__dirname, '..', name)).toString();
}

function assets() {

    const files = {
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

    const assets = {};

    for (let key of Object.keys(files)) {
        const bufs = [];
        for (let fn of files[key]) {
            bufs.push(fs.readFileSync(path.resolve(__dirname, '..', fn)));
            bufs.push(Buffer.from("\n"));
        }
        assets[key] = Buffer.concat(bufs).toString('base64');
    }

    return assets;
}

export function indexTemplate() {
    const content = resolve('web/index.html');
    const data = assets();
    return ejs.render(content, data);
}

export function downloadTemplate(title, body) {
    const content = resolve('web/download.html');
    const data = Object.assign({title, body}, assets());
    return ejs.render(content, data);
}
