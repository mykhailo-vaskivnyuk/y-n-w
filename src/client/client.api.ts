
export const api = (
  fetch: <T>(pathname: string, options?: Record<string, any>) => Promise<T>
) => ({
  'account': {
    'confirm': (options: {
      link: string;
    }) => fetch<any | {
      email: string;
      name: string | any;
      mobile: string | any;
      net_name: string | any;
      confirmed: boolean;
    }>('/account/confirm', options),
    'login': (options: {
      email: string;
      password: string;
    }) => fetch<any | {
      email: string;
      name: string | any;
      mobile: string | any;
      net_name: string | any;
      confirmed: boolean;
    }>('/account/login', options),
    'logout': () => fetch<boolean>('/account/logout'),
    'overmail': (options: {
      email: string;
    }) => fetch<boolean>('/account/overmail', options),
    'remove': () => fetch<boolean>('/account/remove'),
    'restore': (options: {
      link: string;
    }) => fetch<any | {
      email: string;
      name: string | any;
      mobile: string | any;
      net_name: string | any;
      confirmed: boolean;
    }>('/account/restore', options),
    'signup': (options: {
      email: string;
    }) => fetch<any | {
      email: string;
      name: string | any;
      mobile: string | any;
      net_name: string | any;
      confirmed: boolean;
    }>('/account/signup', options),
  },
  'index': () => fetch<string>('/index'),
  'merega': {
    'read': () => fetch<Record<string, any>>('/merega/read'),
  },
  'scripts': {
    'script.js': () => fetch<Record<string, any>>('/scripts/script.js'),
  },
  'user': {
    'create': (options: {
      name: string;
      field: number;
    }) => fetch<{
      name: string;
    }>('/user/create', options),
    'update': () => fetch<string>('/user/update'),
    'read': () => fetch<any | {
      email: string;
      name: string | any;
      mobile: string | any;
      net_name: string | any;
      confirmed: boolean;
    }>('/user/read'),
  },
});
