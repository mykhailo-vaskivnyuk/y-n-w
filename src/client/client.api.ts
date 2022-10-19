export const api = (url: string, fetch: (url: string, options: Record<string, any>) => Promise<any>) => ({
  'index': (options: Record<string, any>) => fetch(url + '/index', options),
  'merega': {
    'read': (options: Record<string, any>) => fetch(url + '/merega/read', options),
  },
  'scripts': {
    'script.js': (options: Record<string, any>) => fetch(url + '/scripts/script.js', options),
  },
  'users': {
    'create': (options: Record<string, any>) => fetch(url + '/users/create', options),
    'update': (options: Record<string, any>) => fetch(url + '/users/update', options),
    'read': (options: Record<string, any>) => fetch(url + '/users/read', options),
  },
});
