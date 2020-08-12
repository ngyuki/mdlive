import fs from 'fs'
import path from 'path'
import ejs from 'ejs'

function resolve(name: string) {
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

    const data = {
        css: '',
        js: '',
    };

    for (const key of Object.keys(files) as Array<keyof typeof files>) {
        const bufs = [];
        for (let fn of files[key]) {
            bufs.push(fs.readFileSync(path.resolve(__dirname, '..', fn)));
            bufs.push(Buffer.from("\n"));
        }
        data[key] = Buffer.concat(bufs).toString('base64');
    }

    return data;
}

let _indexTemplate: (() => string) | null = null;
export function indexTemplate() {
    if (_indexTemplate == null) {
        const template = resolve('web/index.html');
        const data = assets();
        const content = template(data);
        _indexTemplate = () => content;
    }
    return _indexTemplate();
}

let _downloadTemplate: ((title: string, body: string) => string) | null = null;
export function downloadTemplate(title: string, body: string) {
    if (_downloadTemplate == null) {
        const template = resolve('web/download.html')
        const data = assets();
        _downloadTemplate = (title, body) => template(Object.assign({title, body}, data));
    }
    return _downloadTemplate(title, body);
}
