"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MODULES_ENUM = exports.MODULES = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const utils_1 = require("../utils/utils");
const errors_1 = require("./errors");
const errors_2 = require("../db/errors");
const get_stream_1 = require("./modules/get.stream");
const validate_1 = require("./modules/validate");
const set_session_1 = require("./modules/set.session");
const send_mail_1 = require("./modules/send.mail");
exports.MODULES = {
    getStream: get_stream_1.getStream,
    validate: validate_1.validate,
    setSession: set_session_1.setSession,
    setMail: send_mail_1.setMail,
};
exports.MODULES_ENUM = (0, utils_1.getEnumFromMap)(exports.MODULES);
class Router {
    config;
    routes;
    modules = [];
    constructor(config) {
        this.config = config;
    }
    async init() {
        try {
            const { modules, modulesConfig } = this.config;
            modules.map((module) => {
                const moduleConfig = modulesConfig[module];
                this.modules.push(exports.MODULES[module](moduleConfig));
            });
        }
        catch (e) {
            logger.error(e);
            throw new errors_1.RouterError(errors_1.RouterErrorEnum.E_MODULE);
        }
        try {
            this.routes = await this.createRoutes(this.config.apiPath);
        }
        catch (e) {
            logger.error(e);
            throw new errors_1.RouterError(errors_1.RouterErrorEnum.E_ROUTES);
        }
        this.createClientApi();
    }
    async exec(operation) {
        const { names, data: inputData } = operation;
        const inputContext = {};
        const handler = this.findRoute(names);
        const [context, data] = await this.runModules(inputContext, inputData, handler);
        try {
            return await handler(context, data.params);
        }
        catch (e) {
            if (!(e instanceof errors_2.DatabaseError))
                logger.error(e);
            throw new errors_1.RouterError(errors_1.RouterErrorEnum.E_HANDLER, e.message);
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
                if (ext !== '.js')
                    continue;
                const filePath = node_path_1.default.join(routePath, name);
                const moduleExport = require(filePath);
                if (name === 'index') {
                    if (typeof moduleExport === 'function')
                        throw new Error(`Wrong api module: ${filePath}`);
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
            if (this.isHandler(handler))
                throw new errors_1.RouterError(errors_1.RouterErrorEnum.E_NO_ROUTE);
            if (!handler[key])
                throw new errors_1.RouterError(errors_1.RouterErrorEnum.E_NO_ROUTE);
            handler = handler[key];
        }
        if (!this.isHandler(handler))
            throw new errors_1.RouterError(errors_1.RouterErrorEnum.E_NO_ROUTE);
        return handler;
    }
    isHandler(handler) {
        return typeof handler === 'function';
    }
    async runModules(context, data, handler) {
        try {
            for (const module of this.modules)
                [context, data] = await module(context, data, handler);
        }
        catch (e) {
            const { message, details } = e;
            if (e instanceof set_session_1.SessionError)
                throw new errors_1.RouterError(errors_1.RouterErrorEnum.E_ROUTER, message);
            if (e instanceof validate_1.ValidationError)
                throw new errors_1.RouterError(errors_1.RouterErrorEnum.E_MODULE, details);
            if (e instanceof get_stream_1.GetStreamError)
                throw new errors_1.RouterError(errors_1.RouterErrorEnum.E_MODULE, message);
            logger.error(e);
            throw new errors_1.RouterError(errors_1.RouterErrorEnum.E_ROUTER, details || message);
        }
        return [context, data];
    }
    // private createClientApi(routes: IRoutes, url: string): IApi {
    //   if (!this.routes) throw new RouterError(RouterErrorEnum.E_ROUTES);
    //   const urls = {} as IApi;
    //   for (const path of Object.keys(this.routes)) {
    //     const nextUrl = url + '/' + path;
    //     const nextRoutes = this.routes[path];
    //     if (this.isHandler(nextRoutes)) {
    //       urls[path] = (options: Record<string, any>) => Promise.resolve(options); // this.fetch(url, options);
    //     } else {
    //       urls[path] = this.createClientApi(nextRoutes!, nextUrl);
    //     }
    //   }
    //   return urls;
    // }
    createClientApi() {
        if (!this.routes)
            throw new errors_1.RouterError(errors_1.RouterErrorEnum.E_ROUTES);
        const stream = node_fs_1.default.createWriteStream('./src/api.client/api.ts');
        stream.write('module.exports = (url: string, fetch: (url: string, options: Record<string, any>) => Promise<any>) => (');
        this.createJs(this.routes, stream);
        stream.write(');\n');
        stream.close();
    }
    catch(e) {
        // logger.error(e);
        console.log(e);
        throw new errors_1.RouterError(errors_1.RouterErrorEnum.E_ROUTES);
    }
    createJs(routes, stream, pathname = '', indent = '') {
        stream.write('{');
        for (const key of Object.keys(routes)) {
            stream.write('\n' + indent + '  \'' + key + '\': ');
            const handler = routes[key];
            if (this.isHandler(handler)) {
                stream.write('(options: Record<string, any>) => fetch(url + \'' + pathname + '\', options),');
            }
            else {
                this.createJs(handler, stream, pathname + '/' + key, indent + '  ');
                stream.write(',');
            }
        }
        stream.write('\n' + indent + '}');
    }
}
exports.default = Router;
//# sourceMappingURL=router.js.map