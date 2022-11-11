export type TRequire = {
  (modulePath: string): any;
  cache: Record<string, any>;
};
