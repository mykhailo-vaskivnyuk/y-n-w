import Joi from 'joi';
import { IRoutes, THandler, THandlerSchema } from './types';

export const isHandler = (
  handler?: IRoutes | THandler,
): handler is THandler => typeof handler === 'function';

export const isJoiSchema = (
  schema: THandlerSchema,
): schema is Joi.Schema => Joi.isSchema(schema);
