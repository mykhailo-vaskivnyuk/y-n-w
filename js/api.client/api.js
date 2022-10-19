"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const api = (url, fetch) => ({
    'index': (options) => fetch(url + '/index', options),
    'merega': {
        'read': (options) => fetch(url + '/merega/read', options),
    },
    'scripts': {
        'script.js': (options) => fetch(url + '/scripts/script.js', options),
    },
    'users': {
        'create': (options) => fetch(url + '/users/create', options),
        'update': (options) => fetch(url + '/users/update', options),
        'read': (options) => fetch(url + '/users/read', options),
    },
});
exports.api = api;
//# sourceMappingURL=api.js.map