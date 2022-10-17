'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const MIME_TYPES = {
    default: 'application/octet-stream',
    html: 'text/html; charset=UTF-8',
    js: 'application/javascript; charset=UTF-8',
    css: 'text/css',
    png: 'image/png',
    jpg: 'image/jpg',
    gif: 'image/gif',
    ico: 'image/x-icon',
    svg: 'image/svg+xml',
};
const toBool = [() => true, () => false];
const createStaticServer = (staticPath) => {
    const prepareFile = async (url = '/') => {
        const paths = [staticPath, url];
        if (url.endsWith('/'))
            paths.push('index.html');
        const filePath = node_path_1.default.join(...paths);
        const pathTraversal = !filePath.startsWith(staticPath);
        const exists = await node_fs_1.default.promises.access(filePath).then(...toBool);
        const found = !pathTraversal && exists;
        const streamPath = found ? filePath : staticPath + '/404.html';
        const ext = node_path_1.default.extname(streamPath).substring(1).toLowerCase();
        const mimeType = MIME_TYPES[ext] || MIME_TYPES.default;
        const stream = node_fs_1.default.createReadStream(streamPath);
        return { found, mimeType, stream };
    };
    return async (req, res) => {
        const { found, mimeType, stream } = await prepareFile(req.url);
        const statusCode = found ? 200 : 404;
        res.writeHead(statusCode, { 'Content-Type': mimeType });
        stream.pipe(res);
    };
};
exports.default = createStaticServer;
//# sourceMappingURL=static.js.map