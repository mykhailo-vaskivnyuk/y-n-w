import fs from 'node:fs';
import { THandler } from '../../router/types';

const read: THandler = async () => {
  return fs.createReadStream(module.filename);
};

export = { read };
