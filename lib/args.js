"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _util = _interopRequireDefault(require("util"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parse(args) {
  let array = [];
  let output = false;
  let port = 25485;

  for (let i = 0; i < args.length; i++) {
    let arg = args[i];

    switch (arg) {
      case '-o':
        output = true;
        break;

      case '-p':
        port = parseInt(args[++i]);

        if (!port) {
          return false;
        }

        break;

      default:
        if (arg === '--') {
          array = array.concat(args.slice(++i));
          i = args.length;
        } else if (arg[0] === '-') {
          return false;
        } else {
          array.push(arg);
        }

        break;
    }
  }

  if (array.length !== 1) {
    return false;
  }

  return {
    filename: array[0],
    output: output,
    port: port
  };
}

function _default(argv) {
  const options = parse(argv.slice(2));

  if (options == false) {
    console.log(_util.default.format('Usage: %s [-o] [-p <port>] <markdown file>', _path.default.basename(argv[1])));
    process.exit(1);
  }

  return options;
}
//# sourceMappingURL=args.js.map