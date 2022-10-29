
export const api = (
  fetch: (pathname: string, options?: Record<string, any>) => Promise<any>
) => ({
  'account': {
    'confirm': (options: {
      link: string,
    }) => fetch('/account/confirm', options),
    'login': (options: {
      email: string,
      password: string,
    }) => fetch('/account/login', options),
    'logout': () => fetch('/account/logout'),
    'overmail': (options: {
      email: string,
    }) => fetch('/account/overmail', options),
    'remove': () => fetch('/account/remove'),
    'restore': (options: {
      link: string,
    }) => fetch('/account/restore', options),
    'signup': (options: {
      email: string,
    }) => fetch('/account/signup', options),
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
