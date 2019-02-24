'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.readMarkdownFile = readMarkdownFile;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _marked = require('marked');

var _marked2 = _interopRequireDefault(_marked);

var _highlight = require('highlight.js');

var _highlight2 = _interopRequireDefault(_highlight);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function renderer() {
    return Object.assign(new _marked2.default.Renderer(), {
        image: function image(href, title, text) {
            var filename = decodeURIComponent(href);
            if (!/^[a-z]+:\/\//.test(filename)) {
                try {
                    var data = _fs2.default.readFileSync(filename).toString('base64');
                    return '<img alt="' + text + '" src="data:image/png;base64,' + data + '">';
                } catch (err) {
                    // noop
                }
            }
            return _marked2.default.Renderer.prototype.image.call(this, href, title, text);
        }
    });
}

function parseString(input, embedded) {
    return (0, _marked2.default)(input, {
        renderer: embedded ? renderer() : null,
        highlight: function highlight(code, lang) {
            return _highlight2.default.highlightAuto(code, [lang]).value;
        }
    });
};

function readMarkdownFile(filename, embedded) {
    return new Promise(function (resolve) {
        _fs2.default.readFile(filename, function (err, data) {
            if (err) {
                throw err;
            }
            var html = parseString(data.toString(), embedded);
            resolve(html);
        });
    });
}