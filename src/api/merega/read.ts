import Joi from 'joi';
import { THandler } from '../../router/types';

const handler: THandler = async (context, data) => {
  return { ...data, from: 'merega' };
}
handler.responseSchema = Joi.object();

export = handler;
