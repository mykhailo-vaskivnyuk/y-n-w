import path from 'node:path';
import fsp from 'node:fs/promises';
import { IRoutes, THandler } from '../types';

export const createRoutes = async (dirPath: string): Promise<IRoutes> => {
  const route: IRoutes = {};
  const routePath = path.resolve(dirPath);
  const dir = await fsp.opendir(routePath);

  for await (const item of dir) {
    const ext = path.extname(item.name);
    const name = path.basename(item.name, ext);

    if (item.isDirectory()) {
      if (item.name === 'schema') continue;
      const dirPath = path.join(routePath, name);
      route[name] = await createRoutes(dirPath);
      continue;
    }

    if (ext !== '.js' || name === 'types') continue;

    const filePath = path.join(routePath, item.name);
    let moduleExport = require(filePath);
    moduleExport = moduleExport.default || moduleExport as THandler | IRoutes;

    if (name !== 'index') {
      route[name] = moduleExport;
      continue;
    }

    if (typeof moduleExport === 'function')
      throw new Error(`Wrong api module: ${filePath}`);
    else Object.assign(route, moduleExport);
  }

  return route;
};
