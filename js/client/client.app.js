"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const constants_1 = require("./constants");
const event_emmiter_1 = __importDefault(require("./event.emmiter"));
const client_api_1 = require("./client.api");
const client_fetch_1 = require("./client.fetch");
class ClientApp extends event_emmiter_1.default {
    clientApi;
    state = constants_1.AppState.INIT;
    user = null;
    constructor(baseUrl) {
        super();
        const connection = (0, client_fetch_1.getConnection)(baseUrl);
        this.clientApi = (0, client_api_1.api)(connection);
    }
    async init() {
        this.setState(constants_1.AppState.READY);
    }
    setUser(user) {
        this.user = user;
        this.emit('user', this.user);
    }
    getUser() {
        return this.user;
    }
    setState(state) {
        this.state = state;
        this.emit('statechanged', this.state);
    }
    async login(...args) {
        this.setState(constants_1.AppState.LOADING);
        let user = null;
        try {
            user = await this.clientApi.auth.login(...args);
        }
        catch (e) {
            console.log(e);
        }
        this.setUser(user);
        this.setState(constants_1.AppState.READY);
        return Boolean(user);
    }
}
let baseUrl = process.env.API;
if (!baseUrl) {
    const { protocol, host } = window.location;
    baseUrl = `${protocol}//${host}/api`;
}
exports.app = new ClientApp(baseUrl);
//# sourceMappingURL=client.app.js.map