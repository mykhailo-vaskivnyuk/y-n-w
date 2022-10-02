"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app = require("./app/app");
const connection = require("./server/http");
const routing = require("./routing/routing");
app
    .setConnection(connection)
    .setRouting(routing)
    .start();
