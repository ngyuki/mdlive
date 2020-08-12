import fs from 'fs';
import marked from 'marked';
import hljs from 'highlight.js';

class Renderer extends marked.Renderer {

    image(href: string, title: string, text: string): string {
        const filename = decodeURIComponent(href);
        if (!/^[a-z]+:\/\//.test(filename)) {
            try {
                const data = fs.readFileSync(filename).toString('base64');
                return `<img alt="${text}" src="data:image/png;base64,${data}">`;
            } catch (err) {
                // noop
            }
        }
        return super.image(href, title, text);
    }
}

function parseString(input: string, embedded: boolean) {
    return marked(input, {
        renderer: embedded ? new Renderer() : undefined,
        highlight: (code, lang) => {
            return hljs.highlightAuto(code, [lang]).value;
        },
    });
};

export function readMarkdownFile(filename: string, embedded: boolean = false): Promise<string> {
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
