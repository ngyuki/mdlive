import sys from 'util';
import path from 'path';
import http, { IncomingMessage, ServerResponse } from 'http';
import connect, { NextFunction } from 'connect';
import serveStatic from 'serve-static';
import socketIo from 'socket.io';

import { indexTemplate, downloadTemplate } from './template';
import { readMarkdownFile } from './markdown';

export default function(port: number, filename: string) {

    const app = connect();
    const server = http.createServer(app);
    const io = socketIo(server);

    app.use(serveStatic(process.cwd()) as any);

    app.use('/download', async (_req: IncomingMessage, res: ServerResponse, _next: NextFunction) => {
        const html = await readMarkdownFile(filename, true);
        const content = downloadTemplate(filename, html);

        const { name: basename } = path.parse(filename);
        const attachment = path.format({ name: encodeURIComponent(basename), ext: '.html' });

        res.setHeader('Content-disposition', `attachment; filename*=UTF-8''${attachment}`);
        res.setHeader('Content-type', 'text/html');
        res.end(content);
    });

    app.use('/', (_req: IncomingMessage, res: ServerResponse, _next: NextFunction) => {
        res.end(indexTemplate());
    });

    io.sockets.on('connection', (socket) => {
        console.log(sys.format("connected (%s clients)", socket.client.conn.server.clientsCount));

        socket.on('disconnect', function() {
            console.log(sys.format("disconnect (%s clients)", socket.client.conn.server.clientsCount));

            if (socket.client.conn.server.clientsCount === 0) {
                setTimeout(() => {
                    if (socket.client.conn.server.clientsCount === 0) {
                        process.exit();
                    }
                }, 2000)
            }
        });

        app.emit('markdown');
    });

    app.on('markdown', async () => {
        const html = await readMarkdownFile(filename);
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
