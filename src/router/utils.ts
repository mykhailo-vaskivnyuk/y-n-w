import { IRoutes, THandler } from './types';

export const isHandler = (handler?: IRoutes | THandler): handler is THandler => {
  return typeof handler === 'function';
};
