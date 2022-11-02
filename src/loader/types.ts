export type TMode = 'isolate_all' | false;

export type TRequire = {
  (modulePath: string): any;
  main: {
    path: string;
    type: 'loader' | 'require';
  };
};
