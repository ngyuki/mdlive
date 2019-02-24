import fs from 'fs';
import marked from 'marked';
import hljs from 'highlight.js';

function renderer() {
    return Object.assign(new marked.Renderer(), {
        image(href, title, text) {
            const filename = decodeURIComponent(href);
            if (!/^[a-z]+:\/\//.test(filename)) {
                try {
                    const data = fs.readFileSync(filename).toString('base64');
                    return `<img alt="${text}" src="data:image/png;base64,${data}">`;
                } catch (err) {
                    // noop
                }
            }
            return marked.Renderer.prototype.image.call(this, href, title, text);
        }
    });
}

function parseString(input, embedded) {
    return marked(input, {
        renderer: embedded ? renderer() : null,
        highlight: (code, lang) => {
            return hljs.highlightAuto(code, [lang]).value;
        },
    });
};

export function readMarkdownFile(filename, embedded) {
    return new Promise((resolve) => {
        fs.readFile(filename, (err, data) => {
            if (err) {
                throw err;
            }
            const html = parseString(data.toString(), embedded);
            resolve(html);
        });
    });
}
