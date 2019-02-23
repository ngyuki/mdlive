'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (port, callback) {

    var app = (0, _connect2.default)();
    var server = _http2.default.createServer(app);
    var io = (0, _socket2.default)(server);

    app.use('/!/', (0, _serveStatic2.default)(_path2.default.resolve(__dirname, '..', 'web')));
    app.use('', (0, _serveStatic2.default)(_path2.default.resolve(__dirname, '..', 'web')));
    app.use((0, _serveStatic2.default)(process.cwd()));

    io.sockets.on('connection', function (socket) {
        console.log(_util2.default.format("connected (%s clients)", socket.client.conn.server.clientsCount));

        socket.on('disconnect', function () {
            console.log(_util2.default.format("disconnect (%s clients)", socket.client.conn.server.clientsCount));

            if (socket.client.conn.server.clientsCount === 0) {
                setTimeout(function () {
                    if (socket.client.conn.server.clientsCount === 0) {
                        process.exit();
                    }
                }, 2000);
            }
        });

        callback();
    });

    server.listen(port, function () {
        console.log('listening ...', port);
    });

    return io;
};

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _connect = require('connect');

var _connect2 = _interopRequireDefault(_connect);

var _serveStatic = require('serve-static');

var _serveStatic2 = _interopRequireDefault(_serveStatic);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }