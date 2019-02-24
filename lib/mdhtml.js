"use strict";

var _util = _interopRequireDefault(require("util"));

var _path = _interopRequireDefault(require("path"));

var _opn = _interopRequireDefault(require("opn"));

var _template = require("./template");

var _markdown = require("./markdown");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (process.argv.length < 3) {
  console.log(_util.default.format('Usage: %s <markdown file>', _path.default.basename(process.argv[1])));
  process.exit(1);
}

const filename = _path.default.resolve(process.argv[2]);

const basename = _path.default.basename(filename);

process.chdir(_path.default.dirname(filename));

(async function () {
  const html = await (0, _markdown.readMarkdownFile)(basename, true);
  const content = (0, _template.downloadTemplate)(basename, html);
  console.log(content);
})();
//# sourceMappingURL=mdhtml.js.map