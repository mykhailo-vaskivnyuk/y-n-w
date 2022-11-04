"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = exports.ClientApp = void 0;
/* eslint-disable import/no-cycle */
const constants_1 = require("../constants");
const event_emitter_1 = __importDefault(require("../event.emitter"));
const client_api_1 = require("../api/client.api");
const client_fetch_1 = require("../client.fetch");
const account_1 = require("./account");
class ClientApp extends event_emitter_1.default {
    clientApi;
    state = constants_1.AppState.INIT;
    user = null;
    account;
    constructor(baseUrl) {
        super();
        const connection = (0, client_fetch_1.getConnection)(baseUrl);
        this.clientApi = (0, client_api_1.getApi)(connection);
        this.account = (0, account_1.getAccountMethods)(this);
    }
    async init() {
        await this.readUser();
        this.state = constants_1.AppState.READY;
        this.emit('statechanged', this.state);
    }
    getState() {
        return {
            state: this.state,
            user: this.user,
        };
    }
    setUser(user) {
        this.user = user;
        this.emit('user', user);
    }
    setState(state) {
        if (this.state === constants_1.AppState.INIT)
            return;
        this.state = state;
        if (state !== constants_1.AppState.READY) {
            return this.emit('statechanged', this.state);
        }
        Promise.resolve()
            .then(() => this.emit('statechanged', this.state))
            .catch((e) => console.log(e));
    }
    async readUser() {
        this.setState(constants_1.AppState.LOADING);
        try {
            const user = await this.clientApi.user.read();
            this.setUser(user);
            this.setState(constants_1.AppState.READY);
            return user;
        }
        catch (e) {
            this.setState(constants_1.AppState.ERROR);
        }
    }
}
exports.ClientApp = ClientApp;
let baseUrl = process.env.API;
if (!baseUrl) {
    const { protocol, host } = window.location;
    baseUrl = `${protocol}//${host}/api`;
}
exports.app = new ClientApp(baseUrl);
//# sourceMappingURL=client.app.js.map