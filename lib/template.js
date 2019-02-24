'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.indexTemplate = indexTemplate;
exports.downloadTemplate = downloadTemplate;
var fs = require('fs');
var path = require('path');
var ejs = require('ejs');

function resolve(name) {
    var content = fs.readFileSync(path.resolve(__dirname, '..', name)).toString();
    return ejs.compile(content);
}

function assets() {

    var files = {
        css: ['node_modules/github-markdown-css/github-markdown.css', 'node_modules/highlight.js/styles/github-gist.css', 'web/main.css'],
        js: ['node_modules/socket.io-client/dist/socket.io.slim.js', 'web/main.js']
    };

    var data = {};

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = Object.keys(files)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var key = _step.value;

            var bufs = [];
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = files[key][Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var fn = _step2.value;

                    bufs.push(fs.readFileSync(path.resolve(__dirname, '..', fn)));
                    bufs.push(Buffer.from("\n"));
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            data[key] = Buffer.concat(bufs).toString('base64');
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return data;
}

var _indexTemplate = null;
function indexTemplate() {
    if (_indexTemplate == null) {
        var template = resolve('web/index.html');
        var data = assets();
        var content = template(data);
        _indexTemplate = function _indexTemplate() {
            return content;
        };
        console.log("_indexTemplate");
    }
    return _indexTemplate();
}

var _downloadTemplate = null;
function downloadTemplate(title, body) {
    if (_downloadTemplate == null) {
        var template = resolve('web/download.html');
        var data = assets();
        _downloadTemplate = function _downloadTemplate(title, body) {
            return template(Object.assign({ title: title, body: body }, data));
        };
        console.log("_downloadTemplate");
    }
    return _downloadTemplate(title, body);
}