'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (input) {
    return (0, _marked2.default)(input, {
        highlight: function highlight(code, lang) {
            return _highlight2.default.highlightAuto(code, [lang]).value;
        }
    });
};

var _marked = require('marked');

var _marked2 = _interopRequireDefault(_marked);

var _highlight = require('highlight.js');

var _highlight2 = _interopRequireDefault(_highlight);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;