"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const errors_1 = require("./errors");
const methods_1 = require("./methods");
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
            logger.error(e);
            throw new errors_1.RouterError(errors_1.RouterErrorEnum.E_MODULE);
        }
        try {
            const { apiPath } = this.config;
            this.routes = await this.createRoutes(apiPath);
            await (0, create_client_api_1.createClientApi)(this.config, this.routes);
        }
        catch (e) {
            logger.error(e);
            throw new errors_1.RouterError(errors_1.RouterErrorEnum.E_ROUTES);
        }
    }
    async exec({ ...operation }) {
        const { options: { origin }, names, data: { params } } = operation;
        let context = { origin };
        const handler = this.findRoute(names);
        try {
            [context, operation] = await this.runModules(context, operation, handler);
            let response = await handler(context, params);
            [context, response] = await this.runResponseModules(context, response, handler);
            return response;
        }
        catch (e) {
            return (0, error_handler_1.errorHandler)(e);
        }
        finally {
            context.session.finalize();
        }
    }
    async createRoutes(dirPath) {
        const route = {};
        const routePath = node_path_1.default.resolve(dirPath);
        const dir = await node_fs_1.default.promises.opendir(routePath);
        for await (const item of dir) {
            const ext = node_path_1.default.extname(item.name);
            const name = node_path_1.default.basename(item.name, ext);
            if (item.isFile()) {
                if (ext !== '.js' || name === 'types')
                    continue;
                const filePath = node_path_1.default.join(routePath, name);
                const moduleExport = require(filePath);
                if (name === 'index') {
                    if (typeof moduleExport === 'function') {
                        throw new Error(`Wrong api module: ${filePath}`);
                    }
                    Object.assign(route, moduleExport);
                }
                else
                    route[name] = moduleExport;
            }
            else {
                const dirPath = node_path_1.default.join(routePath, name);
                route[name] = await this.createRoutes(dirPath);
            }
        }
        return route;
    }
    findRoute(names) {
        if (!this.routes)
            throw new errors_1.RouterError(errors_1.RouterErrorEnum.E_ROUTES);
        let handler = this.routes;
        for (const key of names) {
            if ((0, methods_1.isHandler)(handler))
                throw new errors_1.RouterError(errors_1.RouterErrorEnum.E_NO_ROUTE);
            if (!handler[key])
                throw new errors_1.RouterError(errors_1.RouterErrorEnum.E_NO_ROUTE);
            handler = handler[key];
        }
        if (!(0, methods_1.isHandler)(handler))
            throw new errors_1.RouterError(errors_1.RouterErrorEnum.E_NO_ROUTE);
        return handler;
    }
    async runModules(context, operation, handler) {
        for (const module of this.modules)
            [context, operation] = await module(context, operation, handler);
        return [context, operation];
    }
    async runResponseModules(context, response, handler) {
        for (const module of this.responseModules)
            [context, response] = await module(context, response, handler);
        return [context, response];
    }
}
exports.default = Router;
//# sourceMappingURL=router.js.map