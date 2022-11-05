import { loader } from './loader'

export type TLoader = {
  (modulePath: string): ReturnType<typeof loader>;
  main: {
    path: string;
  };
};

export type TRequire = {
  (modulePath: string): any;
  main: {
    path: string;
  };
  cache: TCache;
};

export type TCache = Record<string, any>;
