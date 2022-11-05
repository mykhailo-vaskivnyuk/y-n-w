'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStaticServer = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const constants_1 = require("./constants");
const errors_1 = require("./errors");
const utils_1 = require("./utils");
const createStaticServer = (staticPath) => {
    const prepareFile = async (url, unavailable) => {
        const paths = [staticPath, url || constants_1.INDEX];
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
                return { found: false };
            filePath = node_path_1.default.join(staticPath, constants_1.NOT_FOUND);
        }
        else if (unavailable) {
            filePath = node_path_1.default.join(staticPath, constants_1.UNAVAILABLE);
        }
        const ext = node_path_1.default.extname(filePath).substring(1).toLowerCase();
        const mimeType = constants_1.RES_MIME_TYPES[ext] || constants_1.RES_MIME_TYPES.default;
        const stream = node_fs_1.default.createReadStream(filePath);
        return { found, mimeType, stream };
    };
    return async (req, res, context) => {
        const { staticUnavailable } = context;
        const { url, headers } = req;
        const pathname = (0, utils_1.getUrlInstance)(url, headers.host).pathname;
        const path = pathname.replace(/\/$/, '');
        const { found, mimeType, stream } = await prepareFile(path, staticUnavailable);
        let errCode = '';
        let resHeaders = { 'Content-Type': mimeType };
        if (!found && !mimeType) {
            errCode = 'E_REDIRECT';
            resHeaders = { location: '/' };
        }
        else if (!found)
            errCode = 'E_NOT_FOUND';
        else if (staticUnavailable)
            errCode = 'E_UNAVAILABLE';
        const statusCode = errCode ? errors_1.ErrorStatusCodeMap[errCode] : 200;
        const resLog = errCode ? statusCode + ' ' + errors_1.ServerErrorMap[errCode] : 'OK';
        const log = (0, utils_1.getLog)(req, resLog);
        errCode ? logger.error(log) : logger.info(log);
        res.writeHead(statusCode, resHeaders);
        stream?.pipe(res);
    };
};
exports.createStaticServer = createStaticServer;
//# sourceMappingURL=static.js.map