module.exports = (url: string, fetch: (url: string, options: Record<string, any>) => Promise<any>) => ({
  'merega': {
    'read': (options: Record<string, any>) => fetch(url + '/merega', options),
  },
  'scripts': {
    'script.js': (options: Record<string, any>) => fetch(url + '/scripts', options),
  },
  'users': {
    'create': (options: Record<string, any>) => fetch(url + '/users', options),
    'update': (options: Record<string, any>) => fetch(url + '/users', options),
    'read': (options: Record<string, any>) => fetch(url + '/users', options),
  },
});
