import path from 'node:path';
import fsp from 'node:fs/promises';
import { IEndpoints, THandler } from '../types';
import { EXCLUDE_ENDPOINTS } from '../constants';

export const createRoutes = async (dirPath: string): Promise<IEndpoints> => {
  const route: IEndpoints = {};
  const routePath = path.resolve(dirPath);
  const dir = await fsp.opendir(routePath);

  for await (const item of dir) {
    const ext = path.extname(item.name);
    const name = path.basename(item.name, ext);
    if (EXCLUDE_ENDPOINTS.includes(name)) continue;

    if (item.isDirectory()) {
      const dirPath = path.join(routePath, name);
      route[name] = await createRoutes(dirPath);
      continue;
    }

    if (ext !== '.js') continue;

    const filePath = path.join(routePath, item.name);
    let moduleExport = require(filePath);
    moduleExport =
      moduleExport.default || (moduleExport as THandler | IEndpoints);

    if (name !== 'index') {
      route[name] = moduleExport;
      continue;
    }

    if (typeof moduleExport === 'function')
      throw new Error(`Wrong api module: ${filePath}`);

    Object.assign(route, moduleExport);
  }

  // dir.close();
  return route;
};
