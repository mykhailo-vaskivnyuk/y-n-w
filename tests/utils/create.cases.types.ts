
import fs from 'node:fs';
import { Writable } from 'node:stream';
import { TPromiseExecutor } from '../../src/client/common/types';
import { ITestCases, TTestCase } from '../types/types';
import { ITestConfig } from '../config';
import * as tpl from './templates';

export const createCasesTypes = (config: ITestConfig, cases: ITestCases) => {
  const executor: TPromiseExecutor<void> = (rv, rj) => {
    const typesPath = config.casesTypesPath;
    const stream = fs.createWriteStream(typesPath);
    const handleFinish = rv;
    const handleError = (e: Error) => {
      stream.close();
      rj(e);
    };
    stream.on('error', handleError);
    stream.on('finish', handleFinish);
    stream.write(tpl.strHeader());
    createTypes(stream)(cases);
    stream.write(tpl.strFooter());
    stream.close();
  };

  return new Promise(executor);
};

export const isTestCase = (
  testCase?: ITestCases | TTestCase,
): testCase is TTestCase => typeof testCase === 'function';

export const createTypes = (
  stream: Writable,
) => function createTypes(cases: ITestCases, pathname = '', indent = '') {
  stream.write('{');
  const nextIndent = indent + '  ';
  const routesKeys = Object.keys(cases);

  for (const key of routesKeys) {
    stream.write(tpl.strKey(nextIndent, key));
    const testCase = cases[key] as TTestCase | ITestCases;
    const nextPathname = pathname + '/' + key;
    if (!isTestCase(testCase)) {
      createTypes(testCase, nextPathname, nextIndent);
      stream.write(';');
      continue;
    }
    stream.write(tpl.strType());
  }

  stream.write('\n' + indent + '}');
};
