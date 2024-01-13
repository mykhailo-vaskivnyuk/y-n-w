
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

export const isTestUnit = (
  testUnit?: TTestUnit | ITestUnits,
): testUnit is TTestUnit => typeof testUnit === 'function';

export const createTypes = (
  stream: Writable,
) => function createTypes(units: ITestUnits, pathname = '', indent = '') {
  stream.write('{');
  const nextIndent = indent + '  ';
  const routesKeys = Object.keys(units);

  for (const key of routesKeys) {
    stream.write(tpl.strKey(nextIndent, key));
    const testUnit = units[key] as TTestUnit | ITestUnits;
    const nextPathname = pathname + '/' + key;
    if (!isTestUnit(testUnit)) {
      createTypes(testUnit, nextPathname, nextIndent);
      stream.write(';');
      continue;
    }
    stream.write(tpl.strType());
  }

  stream.write('\n' + indent + '}');
};
