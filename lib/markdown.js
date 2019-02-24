"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readMarkdownFile = readMarkdownFile;

var _fs = _interopRequireDefault(require("fs"));

var _marked = _interopRequireDefault(require("marked"));

var _highlight = _interopRequireDefault(require("highlight.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Renderer extends _marked.default.Renderer {
  image(href, title, text) {
    const filename = decodeURIComponent(href);

    if (!/^[a-z]+:\/\//.test(filename)) {
      try {
        const data = _fs.default.readFileSync(filename).toString('base64');

        return `<img alt="${text}" src="data:image/png;base64,${data}">`;
      } catch (err) {// noop
      }
    }

    return super.image(href, title, text);
  }

}

function parseString(input, embedded) {
  return (0, _marked.default)(input, {
    renderer: embedded ? new Renderer() : null,
    highlight: (code, lang) => {
      return _highlight.default.highlightAuto(code, [lang]).value;
    }
  });
}

;

function readMarkdownFile(filename, embedded) {
  return new Promise(resolve => {
    _fs.default.readFile(filename, (err, data) => {
      if (err) {
        throw err;
      }

      const html = parseString(data.toString(), embedded);
      resolve(html);
    });
  });
}
//# sourceMappingURL=markdown.js.map