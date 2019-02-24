"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _fs = _interopRequireDefault(require("fs"));

var _chokidar = _interopRequireDefault(require("chokidar"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(filename, callback) {
  const watcher = _chokidar.default.watch('.', {
    persistent: true,
    ignoreInitial: true,
    depth: 0
  });

  const realpath = _fs.default.realpathSync(filename);

  watcher.on('all', (event, filename) => {
    console.log(event, filename);

    _fs.default.readFile(realpath, (err, data) => {
      if (err) {
        throw err;
      }

      if (realpath === _fs.default.realpathSync(filename)) {
        callback(filename);
      }
    });
  });
}