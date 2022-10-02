"use strict";
class Routing {
    routes;
    constructor() {
        this.routes = {};
    }
    runOperation(operation) {
        return Promise.resolve({ ...operation, from: 'routing' });
    }
}
module.exports = new Routing();
