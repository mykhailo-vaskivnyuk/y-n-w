import path from 'node:path';
import fsp from 'node:fs/promises';
import { ITestUnits } from '../types/types';
import { createUnitsTypes } from './create.units.types';
import { config } from '../config';
import * as casesMap from '../cases';

const EXCLUDE_CASES: string[] = [];

const readUnitsDir = async (dirPath: string): Promise<ITestUnits> => {
  const cases: ITestUnits = {};
  const casesPath = path.resolve(dirPath);
  const dir = await fsp.opendir(casesPath);

  for await (const item of dir) {
    const ext = path.extname(item.name);
    const name = path.basename(item.name, ext);
    if (EXCLUDE_CASES.includes(name)) continue;

    if (item.isDirectory()) {
      const dirPath = path.join(casesPath, name);
      cases[name] = await readUnitsDir(dirPath);
      continue;
    }

    if (ext !== '.js') continue;

    const filePath = path.join(casesPath, item.name);
    let moduleExport = require(filePath);
    moduleExport = moduleExport.default ||
      moduleExport as ITestUnits[string];

    if (name !== 'index') {
      cases[name] = moduleExport;
      continue;
    }

    if (typeof moduleExport === 'function')
      throw new Error(`Wrong api module: ${filePath}`);

    Object.assign(cases, moduleExport);
  }

  // dir.close();
  return cases;
};

export const getUnitsMap = async () => {
  const units = await readUnitsDir(config.unitsPath);
  await createUnitsTypes(config, units);
  return units;
};

export const getCasesAll = () => Object
  .values(casesMap)
  .map(Object.values)
  .flat();
