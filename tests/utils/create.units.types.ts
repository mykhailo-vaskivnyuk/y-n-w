import fs from 'node:fs';
import { Writable } from 'node:stream';
import { TPromiseExecutor } from '../../src/client/common/types';
import { ITestUnits, TTestUnit } from '../types/types';
import { ITestConfig } from '../config';
import * as tpl from './templates';

export const createUnitsTypes = (config: ITestConfig, units: ITestUnits) => {
  const executor: TPromiseExecutor<void> = (rv, rj) => {
    const typesPath = config.unitsTypesPath;
    const stream = fs.createWriteStream(typesPath);
    const handleFinish = rv;
    const handleError = (e: Error) => {
      stream.close();
      rj(e);
    };
    stream.on('error', handleError);
    stream.on('finish', handleFinish);
    stream.write(tpl.strHeader());
    createTypes(stream)(units);
    stream.write(tpl.strFooter());
    stream.close();
  };

  return new Promise(executor);
};

export const isTestUnits = (
  testUnits: ITestUnits[string],
): testUnits is ITestUnits => typeof testUnits !== 'function';

export const isTestUnit = (
  testUnit: ((...args: any[]) => TTestUnit) | TTestUnit,
): testUnit is TTestUnit => {
  try {
    return typeof testUnit({}) !== 'function';
  } catch {
    return true;
  }
};

export const createTypes = (stream: Writable) =>
  function createTypes(units: ITestUnits, pathname = '', indent = '') {
    stream.write('{');
    const nextIndent = indent + '  ';
    const routesKeys = Object.keys(units);

    for (const key of routesKeys) {
      stream.write(tpl.strKey(nextIndent, key));
      const testUnit = units[key] as ITestUnits[string];
      const nextPathname = pathname + '/' + key;
      if (isTestUnits(testUnit)) {
        createTypes(testUnit, nextPathname, nextIndent);
        stream.write(';');
        continue;
      }
      if (isTestUnit(testUnit)) stream.write(tpl.strType());
      else stream.write(tpl.strTypeGetUnit());
    }

    stream.write('\n' + indent + '}');
  };
