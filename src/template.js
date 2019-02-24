const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

function resolve(name) {
    const content = fs.readFileSync(path.resolve(__dirname, '..', name)).toString();
    return ejs.compile(content)
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

    const data = {};

    for (let key of Object.keys(files)) {
        const bufs = [];
        for (let fn of files[key]) {
            bufs.push(fs.readFileSync(path.resolve(__dirname, '..', fn)));
            bufs.push(Buffer.from("\n"));
        }
        data[key] = Buffer.concat(bufs).toString('base64');
    }

    return data;
}

let _indexTemplate = null;
export function indexTemplate() {
    if (_indexTemplate == null) {
        const template = resolve('web/index.html');
        const data = assets();
        const content = template(data);
        _indexTemplate = () => content;
        console.log("_indexTemplate");
    }
    return _indexTemplate();
}

let _downloadTemplate = null;
export function downloadTemplate(title, body) {
    if (_downloadTemplate == null) {
        const template = resolve('web/download.html')
        const data = assets();
        _downloadTemplate = (title, body) => template(Object.assign({title, body}, data));
        console.log("_downloadTemplate");
    }
    return _downloadTemplate(title, body);
}
