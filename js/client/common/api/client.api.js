"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const api = (fetch) => ({
    'account': {
        'confirm': (options) => fetch('/account/confirm', options),
        'login': (options) => fetch('/account/login', options),
        'logout': () => fetch('/account/logout'),
        'overmail': (options) => fetch('/account/overmail', options),
        'remove': () => fetch('/account/remove'),
        'restore': (options) => fetch('/account/restore', options),
        'signup': (options) => fetch('/account/signup', options),
    },
    'index': () => fetch('/index'),
    'merega': {
        'read': () => fetch('/merega/read'),
    },
    'scripts': {
        'script.js': () => fetch('/scripts/script.js'),
    },
    'user': {
        'create': (options) => fetch('/user/create', options),
        'update': () => fetch('/user/update'),
        'read': () => fetch('/user/read'),
    },
});
exports.api = api;
//# sourceMappingURL=client.api.js.map