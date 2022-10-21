
export const api = (
  fetch: (pathname: string, options: Record<string, any>) => Promise<any>
) => ({
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
