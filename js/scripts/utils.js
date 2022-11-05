"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyDir = void 0;
const promises_1 = __importDefault(require("node:fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
const copyDir = async (dirFrom, dirTo, include) => {
    const dir = await promises_1.default.opendir(dirFrom);
    for await (const item of dir) {
        const { name } = item;
        if (item.isDirectory()) {
            if (name === 'local')
                continue;
            const nextDirBack = node_path_1.default.join(dirFrom, name);
            const nextDirFront = node_path_1.default.join(dirTo, name);
            await (0, exports.copyDir)(nextDirBack, nextDirFront, include);
            continue;
        }
        if (include && !include.includes(dirFrom))
            continue;
        const filePathFrom = node_path_1.default.join(dirFrom, name);
        const filePathTo = node_path_1.default.join(dirTo, name);
        promises_1.default.copyFile(filePathFrom, filePathTo);
        console.log('copying', filePathFrom);
    }
};
exports.copyDir = copyDir;
//# sourceMappingURL=utils.js.map