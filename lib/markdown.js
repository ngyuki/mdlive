"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readMarkdownFile = void 0;
const fs_1 = __importDefault(require("fs"));
const marked_1 = __importDefault(require("marked"));
const highlight_js_1 = __importDefault(require("highlight.js"));
class Renderer extends marked_1.default.Renderer {
    image(href, title, text) {
        const filename = decodeURIComponent(href);
        if (!/^[a-z]+:\/\//.test(filename)) {
            try {
                const data = fs_1.default.readFileSync(filename).toString('base64');
                return `<img alt="${text}" src="data:image/png;base64,${data}">`;
            }
            catch (err) {
                // noop
            }
        }
        return super.image(href, title, text);
    }
}
function parseString(input, embedded) {
    return marked_1.default(input, {
        renderer: embedded ? new Renderer() : undefined,
        highlight: (code, lang) => {
            return highlight_js_1.default.highlightAuto(code, [lang]).value;
        },
    });
}
;
function readMarkdownFile(filename, embedded = false) {
    return new Promise((resolve) => {
        fs_1.default.readFile(filename, (err, data) => {
            if (err) {
                throw err;
            }
            const html = parseString(data.toString(), embedded);
            resolve(html);
        });
    });
}
exports.readMarkdownFile = readMarkdownFile;
//# sourceMappingURL=markdown.js.map