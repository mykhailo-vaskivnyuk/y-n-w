"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = void 0;
const connection = async (url, options) => {
    try {
        const response = await fetch(url, options);
        if (response.ok)
            return response.json();
        throw new Error('http response error');
    }
    catch (e) {
        console.log(e);
        throw e;
    }
};
exports.connection = connection;
//# sourceMappingURL=connection.js.map