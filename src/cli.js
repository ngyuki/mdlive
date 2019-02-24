import path from 'path';
import opn from 'opn';

import args from './args';
import server from './server';
import watch from './watch';
import { downloadTemplate } from './template';
import { readMarkdownFile } from './markdown';

const {filename, output} = args(process.argv);
const basename = path.basename(filename);
process.chdir(path.dirname(filename));

if (output) {
    (async function(){
        const html = await readMarkdownFile(basename, true);
        const content = downloadTemplate(basename, html);
        console.log(content);
    })()
} else {
    const port = 25485;
    const app = server(port, basename);
    opn('http://localhost:' + port);
    watch(basename, () => {
        app.emit('markdown');
    });
}
