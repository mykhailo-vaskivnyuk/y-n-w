import Joi from 'joi';
import fs from 'node:fs';

const handler = async () => {
  return fs.createReadStream(module.filename);
};
handler.responseSchema = Joi.object();

export = handler;
