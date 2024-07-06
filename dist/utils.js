"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseArgs = parseArgs;
const minimist_1 = __importDefault(require("minimist"));
function parseArgs(args) {
    const mapped = args.reduce((acc, arg) => {
        const matches = arg.match(/^--str:(.+)/);
        if (matches) {
            acc.strings.push(matches[1]);
            acc.args.push(`--${matches[1]}`);
        }
        else {
            acc.args.push(arg);
        }
        return acc;
    }, { args: [], strings: [] });
    return (0, minimist_1.default)(mapped.args, {
        string: mapped.strings,
    });
}
