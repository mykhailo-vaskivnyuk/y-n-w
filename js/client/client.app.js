"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientApp = void 0;
const client_api_1 = require("./client.api");
const client_fetch_1 = require("./client.fetch");
class ClientApp {
    clientApi;
    constructor(baseUrl) {
        const connection = (0, client_fetch_1.getConnection)(baseUrl);
        this.clientApi = (0, client_api_1.api)(connection);
    }
    async testRequest() {
        const users = await this.clientApi.users.read({});
        console.log(users);
    }
}
exports.ClientApp = ClientApp;
//# sourceMappingURL=client.app.js.map