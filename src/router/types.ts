import Joi, { ObjectSchema } from 'joi';
import { SentMessageInfo } from 'nodemailer';
import { TModulesKeys, TModulesResponseKeys, TServicesKeys } from './constants';
import { IObject } from '../types/types';
import { IOperation, IParams, TOperationResponse } from '../app/types';
import { ITableUsers } from '../db/db.types';
import { Session } from '../services/session/session';

export interface IRouterConfig {
  path: string;
  apiPath: string;
  clientApiPath: string;
  services: TServicesKeys[];
  modules: TModulesKeys[];
  responseModules: TModulesResponseKeys[];
  modulesConfig: {
    [key in
      | TModulesKeys
      | TModulesResponseKeys
      | TServicesKeys
    ]?: Record<string, any>;
  };
}

export interface IRouter {
  init(): Promise<void>;
  exec(operation: IOperation): Promise<TOperationResponse>;
}

export interface IRoutes {
  [key: string]: THandler | IRoutes;
}

export type THandler<
  T extends Partial<IParams> = IParams,
  Q extends TOperationResponse = TOperationResponse
> = {
  (context: IContext, params: T): Promise<Q>;
  paramsSchema?: Record<keyof T, Joi.Schema>;
  schema?: ObjectSchema<T>;
  responseSchema: Q extends IObject
    ? Record<keyof Q, TJoiSchema> | (Record<keyof Q, TJoiSchema> | Joi.Schema)[]
    : TJoiSchema;
};

export type TJoiSchema = Joi.Schema | Joi.Schema[];

export type THandlerSchema = THandler['responseSchema' | 'paramsSchema'];

export interface IServices {
  session: Session<ISessionContent>;
  sendMail: IMailService;
}

export type IContext = IServices & {
   origin: string };

export type TModule<T = any> = (config: T) =>
  (operation: IOperation, context: IContext, handler?: THandler) =>
    Promise<[IOperation, IContext]>;

export type TResponseModule<T = any> = (config?: T) =>
(response: TOperationResponse, context: IContext, handler?: THandler) =>
  Promise<[TOperationResponse, IContext]>;

export type ISessionContent = Partial<{
  user_id: ITableUsers['user_id'];
}>;

export interface IMailService {
  sendMail: {
    confirm: (
      to: string, origin: string, token: string,
    ) => Promise<SentMessageInfo>;
    restore: (
      to: string, origin: string, token: string,
    ) => Promise<SentMessageInfo>;
  };
}

export type TMailType = 'confirm' | 'restore';
