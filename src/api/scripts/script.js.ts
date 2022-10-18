import fs from 'node:fs';

export = async () => {
  return fs.createReadStream(module.filename);
};
