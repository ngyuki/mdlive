import fs from 'fs';
import chokidar from 'chokidar';

export default function(filename: string, callback: (filename: string) => void) {

    const watcher = chokidar.watch('.', {
        persistent: true,
        ignoreInitial: true,
        depth: 0
    });

    const realpath = fs.realpathSync(filename);

    watcher.on('all', (event, filename) => {
        console.log(event, filename);
        try {
            if (realpath === fs.realpathSync(filename)) {
                callback(filename);
            }
        } catch (err) {
            // pass
        }
    });
}
