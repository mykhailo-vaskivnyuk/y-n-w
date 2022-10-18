module.exports = (url: string, fetch: (url: string, options: Record<string, any>) => Promise<any>) => ({
  'index': (options: Record<string, any>) => fetch(url + '', options),
  'merega': {
    'read': (options: Record<string, any>) => fetch(url + '/merega', options),
  },
  'scripts': {
    'script.js': {
      'default': (options: Record<string, any>) => fetch(url + '/scripts/script.js', options),
    },
  },
  'users': {
    'create': (options: Record<string, any>) => fetch(url + '/users', options),
    'update': (options: Record<string, any>) => fetch(url + '/users', options),
    'read': (options: Record<string, any>) => fetch(url + '/users', options),
  },
});
