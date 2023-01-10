import Joi, { ObjectSchema } from 'joi';
import { IObject } from '../types/types';
import {
  IOperation, TOperationResponse, IParams,
} from '../types/operation.types';
import { ITableNodes, ITableUsers } from '../db/db.types';
import { IMailService } from '../services/mail/types';
import {
  PartialUserStatusKeys, UserStatusKeys,
} from '../client/common/api/types/types';
import {
  TInputModulesKeys, TOutputModulesKeys, TServicesKeys,
} from './constants';
import { Session } from '../services/session/session';

export interface IRouterConfig {
  path: string;
  apiPath: string;
  servicesPath: string;
  modulesPath: string;
  clientApiPath: string;
  services: TServicesKeys[];
  inputModules: TInputModulesKeys[];
  outputModules: TOutputModulesKeys[];
  modulesConfig: {
    [key in
      | TInputModulesKeys
      | TOutputModulesKeys
      | TServicesKeys
    ]?: Record<string, any>;
  };
}

export interface IRouter {
  init(): Promise<this>;
  exec(operation: IOperation): Promise<TOperationResponse>;
}

export interface IRoutes {
  [key: string]: THandler | IRoutes;
}

export type THandler<
  T extends IParams = IParams,
  Q extends TOperationResponse = TOperationResponse
> = {
  (context: IContext, params: T): Promise<Q>;
  paramsSchema?: Record<keyof T, TJoiSchema>;
  schema?: ObjectSchema<T>;
  responseSchema: Q extends IObject
    ?
      | TObjectSchema<Q>
      | (TObjectSchema<Q> | Joi.Schema)[]
    : Q extends Array<IObject> ? | TObjectSchema<Q[number]> : TJoiSchema;
  allowedForUser?: PartialUserStatusKeys;
};

export type TObjectSchema<T extends IObject> = {
  [K in keyof T]: T[K] extends IObject ? TObjectSchema<T[K]> : TJoiSchema;
}
export type TArraySchema<T extends Array<any>> = TObjectSchema<T[number]>;
export type TJoiSchema = Joi.Schema | Joi.Schema[];
export type THandlerSchema = THandler['responseSchema' | 'paramsSchema'];

export type IContext = IServices & {
  origin: string;
  userNet?: IUserNet;
  userNetStatus?: UserStatusKeys;
};

export type IUserNet = ITableNodes & {
  confirmed: boolean;
  net_level: number;
}

export interface IServices {
  session: Session<ISessionContent>;
  sendMail: IMailService;
}

export type ISessionContent = Partial<{
  user_id: ITableUsers['user_id'];
  user_status: UserStatusKeys;
}>;

export type TInputModule<T = any> = (config: T) =>
  (operation: IOperation, context: IContext, handler?: THandler) =>
    Promise<IOperation>;

export type TOutputModule<T = any> = (config?: T) =>
(response: TOperationResponse, context: IContext, handler?: THandler) =>
  Promise<TOperationResponse>;
