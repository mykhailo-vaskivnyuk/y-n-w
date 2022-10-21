"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const api = (fetch) => ({
    'index': (options) => fetch('/index', options),
    'merega': {
        'read': (options) => fetch('/merega/read', options),
    },
    'scripts': {
        'script.js': (options) => fetch('/scripts/script.js', options),
    },
    'users': {
        'create': (options) => fetch('/users/create', options),
        'update': (options) => fetch('/users/update', options),
        'read': (options) => fetch('/users/read', options),
    },
});
exports.api = api;
//# sourceMappingURL=client.api.js.map