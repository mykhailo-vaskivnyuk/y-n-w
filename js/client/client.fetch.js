"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConnection = void 0;
const getConnection = (baseUrl) => async (url, data) => {
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    };
    const response = await fetch(baseUrl + url, options);
    const { ok, status, statusText } = response;
    if (ok)
        return response.json();
    throw new Error(`HTTP response error: ${status} / ${statusText}`);
};
exports.getConnection = getConnection;
//# sourceMappingURL=client.fetch.js.map