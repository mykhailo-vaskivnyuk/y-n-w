import Joi from 'joi';
import { THandler } from '../router/types';

const index: THandler<any, string> = async () => 'hello FROM merega';
index.responseSchema = Joi.string();
index.allowedForUser = 'NOT_LOGGEDIN';

const health: THandler<any, string> = async () => 'OK';
health.responseSchema = Joi.string();
health.allowedForUser = 'NOT_LOGGEDIN';

export = { index, health };
