'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (port, filename) {

    var app = (0, _connect2.default)();
    var server = _http2.default.createServer(app);
    var io = (0, _socket2.default)(server);

    app.use((0, _serveStatic2.default)(process.cwd()));

    app.use('/download', function (req, res, next) {
        (0, _markdown.readMarkdownFile)(filename, true).then(function (html) {
            var content = (0, _template.downloadTemplate)(filename, html);

            var _path$parse = _path2.default.parse(filename),
                basename = _path$parse.name;

            var attachment = _path2.default.format({ name: encodeURIComponent(basename), ext: '.html' });

            res.setHeader('Content-disposition', 'attachment; filename*=UTF-8\'\'' + attachment);
            res.setHeader('Content-type', 'text/html');
            res.end(content);
        });
    });

    app.use('/', function (req, res, next) {
        res.end((0, _template.indexTemplate)());
    });

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

        app.emit('markdown');
    });

    app.on('markdown', function () {
        (0, _markdown.readMarkdownFile)(filename).then(function (html) {
            io.sockets.emit('markdown', {
                title: filename,
                body: html
            });
        });
    });

    server.listen(port, function () {
        console.log('listening ...', port);
    });

    return app;
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

var _template = require('./template');

var _markdown = require('./markdown');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }