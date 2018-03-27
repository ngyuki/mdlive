import sys from 'util';
import fs from 'fs';
import path from 'path';
import opn from 'opn';

import markdown from './markdown';
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

function readAndPushMarkdown()
{
    console.log('markdown', filename);
    fs.readFile(filename, function(err, data){
        if (err) {
            throw err;
        }
        const html = markdown(data.toString());
        io.sockets.emit('markdown', {
            title: basename,
            body: html,
        });
    });
}

const io = server(port, readAndPushMarkdown);

opn('http://localhost:' + port);

watch(filename, readAndPushMarkdown);
