import Joi from 'joi';
import { THandler } from '../router/types';

const index: THandler<any, string> = async () => 'hello FROM merega';
index.responseSchema = Joi.string();

export = { index };
