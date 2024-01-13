import path from 'node:path';

const testsPath = path.resolve('js/tests');

export const config = {
  unitsPath: path.join(testsPath, 'units'),
  unitsTypesPath: path.resolve('tests/types/test.units.types.ts'),
};

export type ITestConfig = typeof config;
