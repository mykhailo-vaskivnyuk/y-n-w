import fs from 'node:fs';
import { THandler } from '../../router/types';

export const read: THandler = async () => {
  return fs.createReadStream(module.filename);
};
