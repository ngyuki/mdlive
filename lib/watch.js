"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const chokidar_1 = __importDefault(require("chokidar"));
function default_1(filename, callback) {
    const watcher = chokidar_1.default.watch('.', {
        persistent: true,
        ignoreInitial: true,
        depth: 0
    });
    const realpath = fs_1.default.realpathSync(filename);
    watcher.on('all', (event, filename) => {
        console.log(event, filename);
        try {
            if (realpath === fs_1.default.realpathSync(filename)) {
                callback(filename);
            }
        }
        catch (err) {
            // pass
        }
    });
}
exports.default = default_1;
//# sourceMappingURL=watch.js.map