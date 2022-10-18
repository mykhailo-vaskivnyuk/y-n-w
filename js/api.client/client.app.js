"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("./api");
const connection_1 = require("./connection");
// const baseUrl = 'https://merega.herokuapp.com/api';
class ClientApp {
    clientApi;
    constructor(baseUrl) {
        this.clientApi = (0, api_1.api)(baseUrl, connection_1.connection);
    }
    async testRequest() {
        const users = await this.clientApi.users.read({});
        console.log(users);
    }
}
//# sourceMappingURL=client.app.js.map