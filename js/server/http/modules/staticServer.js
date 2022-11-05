"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.staticServer = void 0;
const static_1 = require("../static");
const getfsApi = (api) => (url = '') => {
    const regExp = new RegExp(`^/${api}(/.*)?$`);
    return regExp.test(url);
};
const staticServer = (config) => {
    const { public: publicPath, api } = config.paths;
    const ifApi = getfsApi(api);
    const httpStaticServer = (0, static_1.createStaticServer)(publicPath);
    return async (req, res, context) => {
        if (ifApi(req.url))
            return true;
        await httpStaticServer(req, res, context);
        return false;
    };
};
exports.staticServer = staticServer;
//# sourceMappingURL=staticServer.js.map