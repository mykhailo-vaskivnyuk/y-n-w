import path from 'node:path';

const testsPath = path.resolve('js/tests');

export const config = {
  casesPath: path.join(testsPath, 'cases'),
  casesTypesPath: path.resolve('tests/types/test.cases.types.ts'),
};

export type ITestConfig = typeof config;
