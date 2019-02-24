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

function parseString(input) {
    return (0, _marked2.default)(input, {
        highlight: function highlight(code, lang) {
            return _highlight2.default.highlightAuto(code, [lang]).value;
        }
    });
};

function readMarkdownFile(filename) {
    return new Promise(function (resolve) {
        _fs2.default.readFile(filename, function (err, data) {
            if (err) {
                throw err;
            }
            var html = parseString(data.toString());
            resolve(html);
        });
    });
}