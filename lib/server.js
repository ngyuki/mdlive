var sys = require('util');
var path = require('path');
var http = require('http');
var connect = require('connect');
var serveStatic = require('serve-static');

module.exports = function(port, callback){

    var app = connect();
    var server = http.createServer(app);
    var io = require('socket.io')(server);

    app.use('/!/node_modules', serveStatic(path.resolve(__dirname, '..', 'node_modules')));
    app.use('/!/', serveStatic(path.resolve(__dirname, '..', 'web')));
    app.use('', serveStatic(path.resolve(__dirname, '..', 'web')));
    app.use(serveStatic(process.cwd()));

    var timer = null;

    io.sockets.on('connection', function(socket){

        console.log(sys.format("connected (%s clients)", socket.client.conn.server.clientsCount));

        if (timer) {
            clearTimeout(timer);
            timer = null;
        }

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
