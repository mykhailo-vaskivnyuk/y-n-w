"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConnection = void 0;
const errors_1 = require("./errors");
const getConnection = (baseUrl) => async (url, data) => {
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data || {}),
        credentials: 'include',
    };
    try {
        const response = await fetch(baseUrl + url, options);
        const { ok, status } = response;
        if (ok)
            return await response.json();
        throw new errors_1.HttpResponseError(status);
    }
    catch (e) {
        console.log(e);
        if (e instanceof errors_1.HttpResponseError)
            throw e;
        throw new errors_1.HttpResponseError(503);
    }
};
exports.getConnection = getConnection;
//# sourceMappingURL=client.fetch.js.map