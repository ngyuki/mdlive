import sys from 'util';
import path from 'path';
import opn from 'opn';

import server from './server';
import watch from './watch';

if (process.argv.length < 3) {
    console.log(sys.format('Usage: %s <markdown file>', path.basename(process.argv[1])));
    process.exit(1);
}

const filename = path.resolve(process.argv[2]);
const basename = path.basename(filename);
const port = 25485;

process.chdir(path.dirname(filename));

const app = server(port, basename);

opn('http://localhost:' + port);

watch(filename, () => {
    app.emit('markdown');
});
