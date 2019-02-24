"use strict";

var _util = _interopRequireDefault(require("util"));

var _path = _interopRequireDefault(require("path"));

var _opn = _interopRequireDefault(require("opn"));

var _server = _interopRequireDefault(require("./server"));

var _watch = _interopRequireDefault(require("./watch"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (process.argv.length < 3) {
  console.log(_util.default.format('Usage: %s <markdown file>', _path.default.basename(process.argv[1])));
  process.exit(1);
}

const filename = _path.default.resolve(process.argv[2]);

const basename = _path.default.basename(filename);

const port = 25485;
process.chdir(_path.default.dirname(filename));
const app = (0, _server.default)(port, basename);
(0, _opn.default)('http://localhost:' + port);
(0, _watch.default)(filename, () => {
  app.emit('markdown');
});
//# sourceMappingURL=cli.js.map