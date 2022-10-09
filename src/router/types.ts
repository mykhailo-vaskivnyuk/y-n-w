import { IOperation, TOperationResponse } from '../app/types';

type IParams = Record<string, unknown>;

export type THandler<T extends IParams = IParams> = {
  (params: T): Promise<TOperationResponse>;
  schema?: T;
};

export interface IRoutes {
  [key: string]: THandler | IRoutes;
}

export type TModule = (data: IOperation['data'], handler?: THandler) =>
  Promise<IOperation['data'] & Record<string, unknown>>;
