import Joi from 'joi';
import fs from 'node:fs';

const handler = async () => fs.createReadStream(__filename);
handler.responseSchema = Joi.object();
handler.allowedForUser = 'NOT_LOGGEDIN';

export = handler;
