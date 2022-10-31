"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccountMethods = void 0;
const constants_1 = require("../constants");
const getAccountMethods = (parent) => ({
    async loginOrSignup(...[type, args]) {
        parent.setState(constants_1.AppState.LOADING);
        try {
            const user = await parent.clientApi.account[type](args);
            user && parent.setUser(user);
            parent.setState(constants_1.AppState.READY);
            return user;
        }
        catch (e) {
            parent.setState(constants_1.AppState.ERROR);
            throw e;
        }
    },
    async logoutOrRemove(type) {
        parent.setState(constants_1.AppState.LOADING);
        try {
            const success = await parent.clientApi.account[type]();
            success && parent.setUser(null);
            parent.setState(constants_1.AppState.READY);
            return success;
        }
        catch (e) {
            parent.setState(constants_1.AppState.ERROR);
            throw e;
        }
    },
    async overmail(...args) {
        parent.setState(constants_1.AppState.LOADING);
        try {
            const success = await parent.clientApi.account.overmail(...args);
            parent.setState(constants_1.AppState.READY);
            return success;
        }
        catch (e) {
            parent.setState(constants_1.AppState.ERROR);
            throw e;
        }
    },
    async loginOverLink(type, ...args) {
        parent.setState(constants_1.AppState.LOADING);
        try {
            const user = await parent.clientApi.account[type](...args);
            user && parent.setUser(user);
            parent.setState(constants_1.AppState.READY);
            return user;
        }
        catch (e) {
            parent.setState(constants_1.AppState.ERROR);
            throw e;
        }
    },
});
exports.getAccountMethods = getAccountMethods;
//# sourceMappingURL=account.js.map