"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const open_1 = __importDefault(require("open"));
const child_process_1 = require("child_process");
const args_1 = __importDefault(require("./args"));
const server_1 = __importDefault(require("./server"));
const watch_1 = __importDefault(require("./watch"));
const template_1 = require("./template");
const markdown_1 = require("./markdown");
const { filename, output, port } = args_1.default(process.argv);
const basename = path_1.default.basename(filename);
process.chdir(path_1.default.dirname(filename));
if (output) {
    (async function () {
        const html = await markdown_1.readMarkdownFile(basename, true);
        const content = template_1.downloadTemplate(basename, html);
        console.log(content);
    })();
}
else {
    const app = server_1.default(port, basename);
    const url = `http://localhost:${port}`;
    if (process.env['MDLIVE_BROWSER']) {
        child_process_1.spawn('sh', ['-c', `${process.env['MDLIVE_BROWSER']} "$1"`, '--', url], {
            stdio: 'ignore',
            detached: true,
            shell: false,
        });
    }
    else {
        open_1.default(url);
    }
    watch_1.default(basename, () => {
        app.emit('markdown');
    });
}
//# sourceMappingURL=cli.js.map