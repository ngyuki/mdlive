import sys from 'util';
import path from 'path';
import http from 'http';
import connect from 'connect';
import serveStatic from 'serve-static';
import socketIo from 'socket.io';

export default function(port, callback){

    const app = connect();
    const server = http.createServer(app);
    const io = socketIo(server);

    app.use('/!/', serveStatic(path.resolve(__dirname, '..', 'web')));
    app.use('', serveStatic(path.resolve(__dirname, '..', 'web')));
    app.use(serveStatic(process.cwd()));

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
