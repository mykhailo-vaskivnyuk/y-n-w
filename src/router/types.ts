import Joi, { ObjectSchema } from 'joi';
import { SentMessageInfo } from 'nodemailer';
import { IOperation, IParams, TOperationResponse } from '../app/types';
import { ITableUsers } from '../db/db.types';
import { Session } from '../services/session/session';
import { IObject } from '../types/types';
import { MODULES, MODULES_RESPONSE } from './constants';

export interface IRouterConfig {
  path: string;
  apiPath: string;
  clientApiPath: string;
  modules: (keyof typeof MODULES)[];
  responseModules: (keyof typeof MODULES_RESPONSE)[];
  modulesConfig: {
    [key in (keyof typeof MODULES | keyof typeof MODULES_RESPONSE)]?: Record<string, any>;
  };
}

export interface IRouter {
  init(): Promise<void>;
  exec(operation: IOperation): Promise<TOperationResponse>;
}

export interface IRoutes {
  [key: string]: THandler | IRoutes;
}

export type THandler<T extends Partial<IParams> = IParams, Q extends TOperationResponse = TOperationResponse> = {
  (context: IContext, params: T): Promise<Q>;
  paramsSchema?: Record<keyof T, Joi.Schema>;
  schema?: ObjectSchema<T>;
  responseSchema: Q extends IObject
    ? Record<keyof Q, JoiSchema> | (Record<keyof Q, JoiSchema> | Joi.Schema)[]
    : JoiSchema;
};

export type JoiSchema = Joi.Schema | Joi.Schema[];

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
  confirm: (to: string, token: string) => Promise<SentMessageInfo>;
  restore: (to: string, token: string) => Promise<SentMessageInfo>;
}

export type TMailType = 'confirm' | 'restore';
