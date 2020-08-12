"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = __importDefault(require("util"));
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const connect_1 = __importDefault(require("connect"));
const serve_static_1 = __importDefault(require("serve-static"));
const socket_io_1 = __importDefault(require("socket.io"));
const template_1 = require("./template");
const markdown_1 = require("./markdown");
function default_1(port, filename) {
    const app = connect_1.default();
    const server = http_1.default.createServer(app);
    const io = socket_io_1.default(server);
    app.use(serve_static_1.default(process.cwd()));
    app.use('/download', async (_req, res, _next) => {
        const html = await markdown_1.readMarkdownFile(filename, true);
        const content = template_1.downloadTemplate(filename, html);
        const { name: basename } = path_1.default.parse(filename);
        const attachment = path_1.default.format({ name: encodeURIComponent(basename), ext: '.html' });
        res.setHeader('Content-disposition', `attachment; filename*=UTF-8''${attachment}`);
        res.setHeader('Content-type', 'text/html');
        res.end(content);
    });
    app.use('/', (_req, res, _next) => {
        res.end(template_1.indexTemplate());
    });
    io.sockets.on('connection', (socket) => {
        console.log(util_1.default.format("connected (%s clients)", socket.client.conn.server.clientsCount));
        socket.on('disconnect', function () {
            console.log(util_1.default.format("disconnect (%s clients)", socket.client.conn.server.clientsCount));
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
        const html = await markdown_1.readMarkdownFile(filename);
        io.sockets.emit('markdown', {
            title: filename,
            body: html,
        });
    });
    server.listen(port, () => {
        console.log(`listening ... http://localhost:${port}`);
    });
    return app;
}
exports.default = default_1;
//# sourceMappingURL=server.js.map