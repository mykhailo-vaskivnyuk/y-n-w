import Joi, { ObjectSchema } from 'joi';
import { IObject } from '../types/types';
import {
  IOperation, TOperationResponse,
  IParams,
} from '../types/operation.types';
import { ITableNets, ITableNodes, ITableUsers } from '../db/db.types';
import { IMailService } from '../services/mail/types';
import {
  PartialUserStatusKeys, UserStatusKeys,
} from '../client/common/constants';
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
      | Record<keyof Q, TJoiSchema>
      // | Record<keyof Q, TJoiSchema | TJoiSchemaArr>
      | (Record<keyof Q, TJoiSchema> | Joi.Schema)[]
    : Q extends Array<any> ? | Record<keyof Q[number], TJoiSchema> : TJoiSchema;
  allowedForUser?: PartialUserStatusKeys;
};

export type IContext = IServices & { origin: string };
export type TJoiSchema = Joi.Schema | Joi.Schema[];
// export type TJoiSchemaArr = Record<string, TJoiSchema>[];
export type THandlerSchema = THandler['responseSchema' | 'paramsSchema'];

export interface IServices {
  session: Session<ISessionContent>;
  sendMail: IMailService;
}

export type ISessionContent = Partial<{
  user_id: ITableUsers['user_id'];
  node_id: ITableNodes['node_id'];
  net_id: ITableNets['net_id'];
  user_status: UserStatusKeys;
}>;

export type TInputModule<T = any> = (config: T) =>
  (operation: IOperation, context: IContext, handler?: THandler) =>
    Promise<IOperation>;

export type TOutputModule<T = any> = (config?: T) =>
(response: TOperationResponse, context: IContext, handler?: THandler) =>
  Promise<TOperationResponse>;
