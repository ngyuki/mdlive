'use strict';

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _opn = require('opn');

var _opn2 = _interopRequireDefault(_opn);

var _server = require('./server');

var _server2 = _interopRequireDefault(_server);

var _watch = require('./watch');

var _watch2 = _interopRequireDefault(_watch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (process.argv.length < 3) {
    console.log(_util2.default.format('Usage: %s <markdown file>', _path2.default.basename(process.argv[1])));
    process.exit(1);
}

var filename = _path2.default.resolve(process.argv[2]);
var basename = _path2.default.basename(filename);
var port = 25485;

process.chdir(_path2.default.dirname(filename));

var app = (0, _server2.default)(port, basename);

(0, _opn2.default)('http://localhost:' + port);

(0, _watch2.default)(filename, function () {
    app.emit('markdown');
});