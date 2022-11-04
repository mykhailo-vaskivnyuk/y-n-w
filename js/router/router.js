"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const promises_1 = __importDefault(require("node:fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
const errors_1 = require("./errors");
const utils_1 = require("./utils");
const create_client_api_1 = require("./methods/create.client.api");
const error_handler_1 = require("./methods/error.handler");
const modules_1 = require("./methods/modules");
class Router {
    config;
    routes;
    modules = [];
    responseModules = [];
    constructor(config) {
        this.config = config;
    }
    async init() {
        try {
            this.modules = (0, modules_1.applyModules)(this.config);
            this.responseModules = (0, modules_1.applyResponseModules)(this.config);
        }
        catch (e) {
            logger.error(e, e.message);
            throw new errors_1.RouterError('E_MODULE');
        }
        try {
            const { apiPath } = this.config;
            this.routes = await this.createRoutes(apiPath);
            await (0, create_client_api_1.createClientApi)(this.config, this.routes);
        }
        catch (e) {
            logger.error(e, e.message);
            throw new errors_1.RouterError('E_ROUTES');
        }
    }
    async exec({ ...operation }) {
        if (!this.routes)
            throw new errors_1.RouterError('E_ROUTES');
        const { options: { origin }, names } = operation;
        let context = { origin };
        const handler = this.findRoute(names);
        try {
            [operation, context] = await this.runModules(operation, context, handler);
            const { params } = operation.data;
            let response = await handler(context, params);
            [response, context] = await this.runResponseModules(response, context, handler);
            return response;
        }
        catch (e) {
            return (0, error_handler_1.errorHandler)(e);
        }
        finally {
            await context.session.finalize();
        }
    }
    async createRoutes(dirPath) {
        const route = {};
        const routePath = node_path_1.default.resolve(dirPath);
        const dir = await promises_1.default.opendir(routePath);
        for await (const item of dir) {
            const ext = node_path_1.default.extname(item.name);
            const name = node_path_1.default.basename(item.name, ext);
            if (item.isDirectory()) {
                const dirPath = node_path_1.default.join(routePath, name);
                route[name] = await this.createRoutes(dirPath);
                continue;
            }
            if (ext !== '.js' || name === 'types')
                continue;
            const filePath = node_path_1.default.join(routePath, item.name);
            const moduleExport = require(filePath);
            if (name !== 'index') {
                route[name] = moduleExport;
                continue;
            }
            if (typeof moduleExport === 'function')
                throw new Error(`Wrong api module: ${filePath}`);
            else
                Object.assign(route, moduleExport);
        }
        return route;
    }
    findRoute(names) {
        let handler = this.routes;
        for (const key of names) {
            if (!(0, utils_1.isHandler)(handler) && key in handler)
                handler = handler[key];
            else
                throw new errors_1.RouterError('E_NO_ROUTE');
        }
        if ((0, utils_1.isHandler)(handler))
            return handler;
        throw new errors_1.RouterError('E_NO_ROUTE');
    }
    async runModules(operation, context, handler) {
        for (const module of this.modules)
            [operation, context] = await module(operation, context, handler);
        return [operation, context];
    }
    async runResponseModules(response, context, handler) {
        for (const module of this.responseModules)
            [response, context] = await module(response, context, handler);
        return [response, context];
    }
}
module.exports = Router;
//# sourceMappingURL=router.js.map