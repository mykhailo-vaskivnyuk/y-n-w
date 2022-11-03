"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const node_http_1 = require("node:http");
const node_stream_1 = require("node:stream");
const node_util_1 = require("node:util");
const constants_1 = require("../../constants/constants");
const errors_1 = require("./errors");
const static_1 = __importDefault(require("./static"));
const utils_1 = require("./utils");
const crypto_1 = require("../../utils/crypto");
const constants_2 = require("./constants");
class HttpConnection {
    config;
    server;
    staticServer;
    callback;
    modules = [];
    constructor(config) {
        this.config = config;
        this.server = (0, node_http_1.createServer)(this.onRequest.bind(this));
        this.staticServer = (0, static_1.default)(this.config.paths.public);
    }
    onOperation(fn) {
        this.callback = fn;
        return this;
    }
    start() {
        if (!this.callback) {
            const e = new errors_1.ServerError(errors_1.ServerErrorEnum.E_NO_CALLBACK);
            logger.error(e);
            throw e;
        }
        try {
            const { modules } = this.config;
            this.modules = modules.map((module) => require(constants_2.HTTP_MODULES[module])[module]());
        }
        catch (e) {
            logger.error(e);
            throw new errors_1.ServerError(errors_1.ServerErrorEnum.E_SERVER_ERROR);
        }
        const executor = (rv, rj) => {
            const { port } = this.config;
            try {
                this.server.listen(port, rv);
            }
            catch (e) {
                logger.error(e);
                rj(new errors_1.ServerError(errors_1.ServerErrorEnum.E_LISTEN));
            }
        };
        return new Promise(executor);
    }
    async onRequest(req, res) {
        if (!this.runModules(req, res))
            return;
        const { api } = this.config.paths;
        const ifApi = new RegExp(`^/${api}(/.*)?$`);
        if (!ifApi.test(req.url || ''))
            return this.staticServer(req, res);
        try {
            const operation = await this.getOperation(req);
            const { options, data: { params } } = operation;
            const { sessionKey } = options;
            sessionKey && res.setHeader('set-cookie', `sessionKey=${sessionKey}; Path=/; httpOnly`);
            const response = await this.callback(operation);
            res.statusCode = 200;
            if (response instanceof node_stream_1.Readable) {
                res.setHeader('content-type', constants_1.MIME_TYPES_ENUM['application/octet-stream']);
                await new Promise((rv, rj) => {
                    response.on('error', rj);
                    response.on('end', rv);
                    res.on('finish', () => logger.info(params, this.getLog(req, 'OK')));
                    response.pipe(res);
                });
                return;
            }
            const data = JSON.stringify(response);
            res.setHeader('content-type', constants_1.MIME_TYPES_ENUM['application/json']);
            res.on('finish', () => logger.info(params, this.getLog(req, 'OK')));
            res.end(data);
        }
        catch (e) {
            this.onError(e, req, res);
        }
    }
    runModules(req, res) {
        for (const module of this.modules) {
            const next = module(req, res);
            if (!next)
                return false;
        }
        return true;
    }
    async getOperation(req) {
        const { options, names, params } = this.getRequestParams(req);
        const data = { params };
        const { headers } = req;
        const contentType = headers['content-type'];
        const length = +(headers['content-length'] || Infinity);
        if (!contentType)
            return { options, names, data };
        if (!constants_1.MIME_TYPES_MAP[contentType]) {
            throw new errors_1.ServerError(errors_1.ServerErrorEnum.E_BED_REQUEST);
        }
        if (length > constants_1.MIME_TYPES_MAP[contentType].maxLength) {
            throw new errors_1.ServerError(errors_1.ServerErrorEnum.E_BED_REQUEST);
        }
        if (contentType === constants_1.MIME_TYPES_ENUM['application/json'] && length < constants_1.JSON_TRANSFORM_LENGTH) {
            Object.assign(params, await this.getJson(req));
            return { options, names, data };
        }
        const content = node_stream_1.Readable.from(req);
        data.stream = { type: contentType, content };
        return { options, names, data };
    }
    getRequestParams(req) {
        const { origin, cookie } = req.headers;
        const { pathname, searchParams } = (0, utils_1.getUrlInstance)(req.url, origin);
        const names = (pathname
            .replace('/' + this.config.paths.api, '')
            .slice(1) || 'index')
            .split('/')
            .filter((path) => Boolean(path));
        const params = {};
        const queryParams = searchParams.entries();
        for (const [key, value] of queryParams)
            params[key] = value;
        const options = {};
        options.sessionKey = this.getSessionKey(cookie);
        options.origin = origin || '';
        return { options, names, params };
    }
    getSessionKey(cookie) {
        if (cookie) {
            const regExp = /sessionKey=([^\s]*)\s*;?/;
            const [, result] = cookie.match(regExp) || [];
            if (result)
                return result;
        }
        return (0, crypto_1.createUnicCode)(15);
    }
    async getJson(req) {
        try {
            const buffers = [];
            for await (const chunk of req)
                buffers.push(chunk);
            const data = Buffer.concat(buffers).toString();
            return JSON.parse(data);
        }
        catch (e) {
            logger.error(e);
            throw new errors_1.ServerError(errors_1.ServerErrorEnum.E_BED_REQUEST);
        }
    }
    getLog(req, resLog = '') {
        const { pathname } = (0, utils_1.getUrlInstance)(req.url, req.headers.host);
        return (0, node_util_1.format)('%s %s', req.method, pathname, '-', resLog);
    }
    onError(e, req, res) {
        let error = e;
        if (!(e instanceof errors_1.ServerError)) {
            error = new errors_1.ServerError(errors_1.ServerErrorEnum.E_SERVER_ERROR);
        }
        const { code, statusCode = 500, details } = error;
        res.statusCode = statusCode;
        if (code === errors_1.ServerErrorEnum.E_REDIRECT)
            res.setHeader('location', details?.location || '/');
        details && res.setHeader('content-type', constants_1.MIME_TYPES_ENUM['application/json']);
        logger.error({}, this.getLog(req, errors_1.ServerErrorMap[code]));
        res.end(error.getMessage());
        if (code === errors_1.ServerErrorEnum.E_SERVER_ERROR)
            throw e;
    }
}
module.exports = HttpConnection;
//# sourceMappingURL=http.js.map