"use strict";

var _path = _interopRequireDefault(require("path"));

var _opn = _interopRequireDefault(require("opn"));

var _child_process = require("child_process");

var _args = _interopRequireDefault(require("./args"));

var _server = _interopRequireDefault(require("./server"));

var _watch = _interopRequireDefault(require("./watch"));

var _template = require("./template");

var _markdown = require("./markdown");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  filename,
  output,
  port
} = (0, _args.default)(process.argv);

const basename = _path.default.basename(filename);

process.chdir(_path.default.dirname(filename));

if (output) {
  (async function () {
    const html = await (0, _markdown.readMarkdownFile)(basename, true);
    const content = (0, _template.downloadTemplate)(basename, html);
    console.log(content);
  })();
} else {
  const app = (0, _server.default)(port, basename);
  const url = `http://localhost:${port}`;

  if (process.env['MDLIVE_BROWSER']) {
    (0, _child_process.spawn)('sh', ['-c', `${process.env['MDLIVE_BROWSER']} "$1"`, '--', url], {
      stdio: 'ignore',
      detached: true,
      shell: false
    });
  } else {
    (0, _opn.default)(url);
  }

  (0, _watch.default)(basename, () => {
    app.emit('markdown');
  });
}
//# sourceMappingURL=cli.js.map