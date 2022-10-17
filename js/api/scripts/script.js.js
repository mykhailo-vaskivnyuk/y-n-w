"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importDefault(require("node:fs"));
exports.default = async () => {
    return node_fs_1.default.createReadStream(module.filename);
};
//# sourceMappingURL=script.js.js.map