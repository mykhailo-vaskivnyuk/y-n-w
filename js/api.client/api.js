"use strict";
module.exports = (url, fetch) => ({
    'index': (options) => fetch(url + '', options),
    'merega': {
        'read': (options) => fetch(url + '/merega', options),
    },
    'scripts': {
        'script.js': {
            'default': (options) => fetch(url + '/scripts/script.js', options),
        },
    },
    'users': {
        'create': (options) => fetch(url + '/users', options),
        'update': (options) => fetch(url + '/users', options),
        'read': (options) => fetch(url + '/users', options),
    },
});
//# sourceMappingURL=api.js.map