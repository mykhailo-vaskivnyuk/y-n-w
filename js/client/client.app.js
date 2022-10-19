"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientApp = void 0;
const client_api_1 = require("./client.api");
const client_fetch_1 = require("./client.fetch");
// const baseUrl = 'https://merega.herokuapp.com/api';
class ClientApp {
    clientApi;
    constructor(baseUrl) {
        this.clientApi = (0, client_api_1.api)(baseUrl, client_fetch_1.connection);
    }
    async testRequest() {
        const users = await this.clientApi.users.read({});
        console.log(users);
    }
}
exports.ClientApp = ClientApp;
//# sourceMappingURL=client.app.js.map