
export const api = (
  fetch: (pathname: string, options?: Record<string, any>) => Promise<any>
) => ({
  'auth': {
    'confirm': (options: {
      link: string,
    }) => fetch('/auth/confirm', options),
    'login': (options: {
      email: string,
      password: string,
    }) => fetch('/auth/login', options),
    'logout': () => fetch('/auth/logout'),
    'overmail': (options: {
      email: string,
    }) => fetch('/auth/overmail', options),
    'remove': () => fetch('/auth/remove'),
    'restore': (options: {
      link: string,
    }) => fetch('/auth/restore', options),
    'signup': (options: {
      email: string,
    }) => fetch('/auth/signup', options),
  },
  'index': () => fetch('/index'),
  'merega': {
    'read': () => fetch('/merega/read'),
  },
  'scripts': {
    'script.js': () => fetch('/scripts/script.js'),
  },
  'user': {
    'create': (options: {
      name: string,
      field: number,
    }) => fetch('/user/create', options),
    'update': () => fetch('/user/update'),
    'read': () => fetch('/user/read'),
  },
});
