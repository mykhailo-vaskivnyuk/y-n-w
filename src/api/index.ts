import Joi from 'joi';
import { THandler } from '../router/types';

const health: THandler<never, string> = async () => 'API IS READY';
health.responseSchema = Joi.string();
health.allowedForUser = 'NOT_LOGGEDIN';

export = { health };
