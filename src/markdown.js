import fs from 'fs';
import marked from 'marked';
import hljs from 'highlight.js';

function parseString(input) {
    return marked(input, {
        highlight: (code, lang) => {
            return hljs.highlightAuto(code, [lang]).value;
        }
    });
};

export function readMarkdownFile(filename) {
    return new Promise((resolve) => {
        fs.readFile(filename, (err, data) => {
            if (err) {
                throw err;
            }
            const html = parseString(data.toString());
            resolve(html);
        });
    });
}
