"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const node_path_1 = __importDefault(require("node:path"));
const buildPath = 'js';
const host = process.env.HOST || 'localhost';
const port = +(process.env.PORT || 8000);
const dbConectionType = process.env.DATABASE_URL ? 'heroku' : 'local';
const dbConnection = {
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
}[dbConectionType];
const config = {
    logger: {
        path: node_path_1.default.resolve(buildPath, 'logger/logger'),
        level: 'DEBUG',
        target: 'console',
    },
    database: {
        path: node_path_1.default.resolve(buildPath, 'db/db'),
        queriesPath: node_path_1.default.resolve(buildPath, 'db/queries'),
        connection: {
            path: node_path_1.default.resolve(buildPath, 'db/connection/pg'),
            ...dbConnection,
        },
    },
    router: {
        path: node_path_1.default.resolve(buildPath, 'router/router'),
        apiPath: node_path_1.default.join(buildPath, 'api'),
        clientApiPath: 'src/client/common/api/client.api.ts',
        modules: [
            'setSession',
            'getStream',
            'validate',
            'setMailService',
        ],
        responseModules: ['validateResponse'],
        modulesConfig: {
            setMailService: {
                service: 'gmail',
                auth: {
                    user: 'm.vaskivnyuk@gmail.com',
                    pass: 'jnvmldmwaiadoiwj',
                },
            },
        },
    },
    inConnection: {
        transport: 'http',
        http: {
            path: node_path_1.default.resolve(buildPath, 'server/http/http'),
            paths: {
                public: 'public',
                api: 'api',
            },
            modules: ['allowCors'],
            host,
            port,
        },
        ws: {
            path: node_path_1.default.resolve(buildPath, 'server/ws'),
            host,
            port,
        },
    },
};
module.exports = config;
//# sourceMappingURL=config.js.map