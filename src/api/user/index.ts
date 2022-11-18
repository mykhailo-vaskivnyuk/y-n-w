import Joi from 'joi';
import { THandler } from '../../router/types';

const update: THandler = async () => '';
update.responseSchema = Joi.string();

export = { update };
