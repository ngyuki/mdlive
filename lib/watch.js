'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (filename, callback) {

    var watcher = _chokidar2.default.watch('.', {
        persistent: true,
        ignoreInitial: true,
        depth: 0
    });

    var realpath = _fs2.default.realpathSync(filename);

    watcher.on('all', function (event, filename) {
        console.log(event, filename);

        _fs2.default.readFile(realpath, function (err, data) {
            if (err) {
                throw err;
            }
            if (realpath === _fs2.default.realpathSync(filename)) {
                callback(filename);
            }
        });
    });
};

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _chokidar = require('chokidar');

var _chokidar2 = _interopRequireDefault(_chokidar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }