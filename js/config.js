"use strict";
const types_1 = require("./logger/types");
const router_1 = require("./router/router");
const buildPath = './js';
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
        queriesPath: buildPath + '/db/queries',
        connection: databaseConnection[process.env.DATABASE_URL ? 'heroku' : 'local'],
    },
    router: {
        apiPath: buildPath + '/api',
        modules: [
            router_1.MODULES_ENUM.setSession,
            router_1.MODULES_ENUM.getStream,
            router_1.MODULES_ENUM.validate,
            router_1.MODULES_ENUM.setMail,
        ],
        modulesConfig: {
            [router_1.MODULES_ENUM.setMail]: {
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
            host,
            port: +(process.env.PORT || 8000),
        },
    },
};
//# sourceMappingURL=config.js.map