import path from 'path';
import opn from 'opn';
import { spawn } from 'child_process';

import args from './args';
import server from './server';
import watch from './watch';
import { downloadTemplate } from './template';
import { readMarkdownFile } from './markdown';

const {filename, output, port} = args(process.argv);
const basename = path.basename(filename);
process.chdir(path.dirname(filename));

if (output) {
    (async function(){
        const html = await readMarkdownFile(basename, true);
        const content = downloadTemplate(basename, html);
        console.log(content);
    })()
} else {
    const app = server(port, basename);
    const url = `http://localhost:${port}`;
    if (process.env['MDLIVE_BROWSER']) {
        spawn('sh', ['-c', `${process.env['MDLIVE_BROWSER']} "$1"`, '--', url], {
            stdio: 'ignore',
            detached: true,
            shell: false,
        });
    } else {
        opn(url);
    }
    watch(basename, () => {
        app.emit('markdown');
    });
}
