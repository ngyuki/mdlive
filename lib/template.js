"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadTemplate = exports.indexTemplate = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
function resolve(name) {
    const content = fs_1.default.readFileSync(path_1.default.resolve(__dirname, '..', name)).toString();
    return ejs_1.default.compile(content);
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
    for (const key of Object.keys(files)) {
        const bufs = [];
        for (let fn of files[key]) {
            bufs.push(fs_1.default.readFileSync(path_1.default.resolve(__dirname, '..', fn)));
            bufs.push(Buffer.from("\n"));
        }
        data[key] = Buffer.concat(bufs).toString('base64');
    }
    return data;
}
let _indexTemplate = null;
function indexTemplate() {
    if (_indexTemplate == null) {
        const template = resolve('web/index.html');
        const data = assets();
        const content = template(data);
        _indexTemplate = () => content;
    }
    return _indexTemplate();
}
exports.indexTemplate = indexTemplate;
let _downloadTemplate = null;
function downloadTemplate(title, body) {
    if (_downloadTemplate == null) {
        const template = resolve('web/download.html');
        const data = assets();
        _downloadTemplate = (title, body) => template(Object.assign({ title, body }, data));
    }
    return _downloadTemplate(title, body);
}
exports.downloadTemplate = downloadTemplate;
//# sourceMappingURL=template.js.map