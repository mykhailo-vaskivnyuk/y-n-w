"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const node_path_1 = __importDefault(require("node:path"));
const types_1 = require("./logger/types");
const constants_1 = require("./router/constants");
const http_1 = require("./server/http");
const buildPath = 'js';
const host = process.env.HOST || 'localhost';
const databaseConnection = {
    heroku: {
        connectionString: process.env.DATABASE_URL || '',
        ssl: {
            rejectUnauthorized: false,
        },
    },
    local: {
        host,
        port: 5432,
        database: 'merega',
        user: 'merega',
        password: 'merega',
    },
};
module.exports = {
    logger: {
        level: types_1.LOGGER_LEVEL.DEBUG,
        target: types_1.LOGGER_TARGET.CONSOLE,
    },
    database: {
        queriesPath: node_path_1.default.join(buildPath, 'db/queries'),
        connection: databaseConnection[process.env.DATABASE_URL ? 'heroku' : 'local'],
    },
    router: {
        apiPath: node_path_1.default.join(buildPath, 'api'),
        clientApiPath: 'src/client/common/api/client.api.ts',
        modules: [
            constants_1.MODULES_ENUM.setSession,
            constants_1.MODULES_ENUM.getStream,
            constants_1.MODULES_ENUM.validate,
            constants_1.MODULES_ENUM.setMailService,
        ],
        responseModules: [
            constants_1.MODULES_RESPONSE_ENUM.validateResponse,
        ],
        modulesConfig: {
            [constants_1.MODULES_ENUM.setMailService]: {
                service: 'gmail',
                auth: {
                    user: 'm.vaskivnyuk@gmail.com',
                    pass: 'jnvmldmwaiadoiwj',
                },
            },
        },
    },
    inConnection: {
        path: {
            public: 'public',
            api: 'api',
        },
        http: {
            modules: [
                http_1.HTTP_MODULES_ENUM.allowCors,
            ],
            host,
            port: +(process.env.PORT || 8000),
        },
    },
};
//# sourceMappingURL=config.js.map