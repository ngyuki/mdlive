import sys from 'util';
import http from 'http';
import connect from 'connect';
import serveStatic from 'serve-static';
import socketIo from 'socket.io';

import template from './template';

export default function(port, callback){

    const app = connect();
    const server = http.createServer(app);
    const io = socketIo(server);

    app.use(serveStatic(process.cwd()));

    app.use('/', (req, res, next) => {
        res.end(template());
    });

    io.sockets.on('connection', function(socket){
        console.log(sys.format("connected (%s clients)", socket.client.conn.server.clientsCount));

        socket.on('disconnect', function(){
            console.log(sys.format("disconnect (%s clients)", socket.client.conn.server.clientsCount));

            if (socket.client.conn.server.clientsCount === 0) {
                setTimeout(function(){
                    if (socket.client.conn.server.clientsCount === 0) {
                        process.exit();
                    }
                }, 2000)
            }
        });

        callback();
    });

    server.listen(port, function(){
        console.log('listening ...', port);
    });

    return io;
}
