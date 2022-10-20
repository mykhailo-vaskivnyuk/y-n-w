'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const types_1 = require("./types");
const utils_1 = require("./utils");
const createStaticServer = (staticPath) => {
    const prepareFile = async (url) => {
        const paths = [staticPath, url || types_1.INDEX];
        let filePath = node_path_1.default.join(...paths);
        const notTraversal = filePath.startsWith(staticPath);
        const found = notTraversal &&
            await node_fs_1.default.promises
                .stat(filePath)
                .then((file) => file.isFile())
                .catch(() => false);
        if (!found) {
            const ext = node_path_1.default.extname(filePath);
            if (!ext)
                return { found };
            filePath = node_path_1.default.join(staticPath, types_1.NOT_FOUND);
        }
        const ext = node_path_1.default.extname(filePath).substring(1).toLowerCase();
        const mimeType = types_1.MIME_TYPES[ext] || types_1.MIME_TYPES.default;
        const stream = node_fs_1.default.createReadStream(filePath);
        return { found, mimeType, stream };
    };
    return async (req, res) => {
        const { pathname } = (0, utils_1.getUrlInstance)(req.url, req.headers.host);
        const path = pathname.replace(/\/$/, '');
        const { found, mimeType, stream } = await prepareFile(path);
        if (!found && !mimeType) {
            res.writeHead(301, { location: '/' });
            res.end();
            return;
        }
        const statusCode = found ? 200 : 404;
        res.writeHead(statusCode, { 'Content-Type': mimeType });
        stream?.pipe(res);
    };
};
exports.default = createStaticServer;
//# sourceMappingURL=static.js.map