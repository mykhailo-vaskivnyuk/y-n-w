import Joi from 'joi';
import { IRoutes, THandler, THandlerSchema } from './types';

export const isHandler = (handler?: IRoutes | THandler): handler is THandler => {
  return typeof handler === 'function';
};

export const isJoiSchema = (schema: THandlerSchema): schema is Joi.Schema => {
  return Joi.isSchema(schema);
};
