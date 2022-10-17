import fs from 'node:fs';

export default async () => {
  return fs.createReadStream(module.filename);
};
