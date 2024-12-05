import Joi from 'joi';
import { THandler } from '../../../controller/types';

export const name: THandler<never, string> = async () => env.TG_BOT || '';
name.responseSchema = Joi.string();
name.allowedForUser = 'NOT_LOGGEDIN';
