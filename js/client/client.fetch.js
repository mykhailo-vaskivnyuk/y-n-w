"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConnection = void 0;
const getConnection = (baseUrl) => async (url, options) => {
    try {
        const response = await fetch(baseUrl + url, options);
        const { ok, status, statusText } = response;
        if (ok)
            return response.json();
        throw new Error(`HTTP response error: ${status} / ${statusText}`);
    }
    catch (e) {
        console.log(e);
        throw e;
    }
};
<<<<<<< HEAD
exports.getConnection = getConnection;
=======
exports.connection = connection;
>>>>>>> 09d5a9ae85dd9f39aedc1e938d1a93a34c65f28b
//# sourceMappingURL=client.fetch.js.map