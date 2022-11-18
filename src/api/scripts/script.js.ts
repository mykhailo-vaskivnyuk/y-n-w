import fs from 'node:fs';
import Joi from 'joi';

const handler = async () => fs.createReadStream(__filename);
handler.responseSchema = Joi.object();
handler.allowedForUser = 'NOT_LOGGEDIN';

export = handler;
