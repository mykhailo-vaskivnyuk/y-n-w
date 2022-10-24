
export const api = (
  fetch: (pathname: string, options: Record<string, any>) => Promise<any>
) => ({
  'auth': {
    'confirm': (options: {
      link: string,
      restore: string,
      redirect: string,
    }) => fetch('/auth/confirm', options),
    'login': (options: {
      email: string,
      password: string,
    }) => fetch('/auth/login', options),
    'logout': (options: Record<string, any>) => fetch('/auth/logout', options),
    'overmail': (options: {
      email: string,
    }) => fetch('/auth/overmail', options),
    'remove': (options: Record<string, any>) => fetch('/auth/remove', options),
    'signup': (options: {
      email: string,
    }) => fetch('/auth/signup', options),
  },
  'index': (options: Record<string, any>) => fetch('/index', options),
  'merega': {
    'read': (options: Record<string, any>) => fetch('/merega/read', options),
  },
  'scripts': {
    'script.js': (options: Record<string, any>) => fetch('/scripts/script.js', options),
  },
  'users': {
    'create': (options: {
      name: string,
      field: number,
    }) => fetch('/users/create', options),
    'update': (options: Record<string, any>) => fetch('/users/update', options),
    'read': (options: Record<string, any>) => fetch('/users/read', options),
  },
});
