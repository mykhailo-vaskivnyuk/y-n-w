import Joi from 'joi';
import { THandler } from '../router/types';

const index: THandler<any, string> = async () => 'hello FROM merega';
index.responseSchema = Joi.string();

const health: THandler<any, string> = async () => 'OK';
health.responseSchema = Joi.string();

export = { index, health };
