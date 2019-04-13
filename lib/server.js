"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _util = _interopRequireDefault(require("util"));

var _path = _interopRequireDefault(require("path"));

var _http = _interopRequireDefault(require("http"));

var _connect = _interopRequireDefault(require("connect"));

var _serveStatic = _interopRequireDefault(require("serve-static"));

var _socket = _interopRequireDefault(require("socket.io"));

var _template = require("./template");

var _markdown = require("./markdown");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(port, filename) {
  const app = (0, _connect.default)();

  const server = _http.default.createServer(app);

  const io = (0, _socket.default)(server);
  app.use((0, _serveStatic.default)(process.cwd()));
  app.use('/download', async (req, res, next) => {
    const html = await (0, _markdown.readMarkdownFile)(filename, true);
    const content = (0, _template.downloadTemplate)(filename, html);

    const {
      name: basename
    } = _path.default.parse(filename);

    const attachment = _path.default.format({
      name: encodeURIComponent(basename),
      ext: '.html'
    });

    res.setHeader('Content-disposition', `attachment; filename*=UTF-8''${attachment}`);
    res.setHeader('Content-type', 'text/html');
    res.end(content);
  });
  app.use('/', (req, res, next) => {
    res.end((0, _template.indexTemplate)());
  });
  io.sockets.on('connection', socket => {
    console.log(_util.default.format("connected (%s clients)", socket.client.conn.server.clientsCount));
    socket.on('disconnect', function () {
      console.log(_util.default.format("disconnect (%s clients)", socket.client.conn.server.clientsCount));

      if (socket.client.conn.server.clientsCount === 0) {
        setTimeout(() => {
          if (socket.client.conn.server.clientsCount === 0) {
            process.exit();
          }
        }, 2000);
      }
    });
    app.emit('markdown');
  });
  app.on('markdown', async () => {
    const html = await (0, _markdown.readMarkdownFile)(filename);
    io.sockets.emit('markdown', {
      title: filename,
      body: html
    });
  });
  server.listen(port, () => {
    console.log(`listening ... http://localhost:${port}`);
  });
  return app;
}
//# sourceMappingURL=server.js.map