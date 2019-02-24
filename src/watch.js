import fs from 'fs';
import chokidar from 'chokidar';

export default function(filename, callback) {

    const watcher = chokidar.watch('.', {
        persistent: true,
        ignoreInitial: true,
        depth: 0
    });

    const realpath = fs.realpathSync(filename);

    watcher.on('all', (event, filename) => {
        console.log(event, filename);

        fs.readFile(realpath, (err, data) => {
            if (err) {
                throw err;
            }
            if (realpath === fs.realpathSync(filename)) {
                callback(filename);
            }
        });
    });
}
