var fs = require('fs');
var chokidar = require('chokidar');

module.exports = function(filename, callback){

    // link: https://github.com/paulmillr/chokidar
    var watcher = chokidar.watch('.', {
        persistent: true,
        ignoreInitial: true,
        depth: 0
    });

    var realpath = fs.realpathSync(filename);

    watcher.on('all', function(event, filename){
        console.log(event, filename);

        fs.readFile(realpath, function(err, data){
            if (err) {
                throw err;
            }
            if (realpath === fs.realpathSync(filename)) {
                callback(filename);
            }
        });
    });
}
