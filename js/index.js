"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("./config");
const app_1 = __importDefault(require("./app/app"));
const logger_1 = __importDefault(require("./logger/logger"));
const pg_1 = __importDefault(require("./db/connection/pg"));
const router_1 = __importDefault(require("./router/router"));
const http_1 = __importDefault(require("./server/http"));
new app_1.default(config)
    .setLogger(logger_1.default)
    .setDatabase(pg_1.default)
    .setRouter(router_1.default)
    .setInputConnection(http_1.default)
    .start();
//# sourceMappingURL=index.js.map