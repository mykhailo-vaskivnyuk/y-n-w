import { ObjectSchema } from 'joi';
import { IOperation, IParams, TOperationResponse } from '../app/types';
import { Session } from '../services/session/session';

export type THandler<T extends IParams = IParams> = {
  (context: IContext, params: T): Promise<TOperationResponse>;
  schema?: ObjectSchema<T>;
};

export interface IRoutes {
  [key: string]: THandler | IRoutes;
}

export interface IContext {
  session: Session<ISessionContent>,
}

export type ServicesEnum = keyof IContext;

export type TModule = (context: IContext, data: IOperation['data'], handler?: THandler) =>
  Promise<[IContext, IOperation['data'] & Record<string, unknown>]>;

export type ISessionContent = Partial<{
  userId: number;
}>;
