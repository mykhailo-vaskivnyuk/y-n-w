// import { createEnumFromArray } from '../src/utils/utils';
import { createCases } from './utils/create.cases';
import { config } from './config';
import { createCasesTypes } from './utils/create.cases.types';
// const dataVersionMap = [
//   'version1',
//   'versoin2',
// ] as const;

// type dataVersionKeys = typeof dataVersionMap[number];
// const dataVersionEnum = createEnumFromArray(dataVersionMap);

// export const getTestData = (
//   state: any, dataVersion: dataVersionKeys,
// ): ITestCase[] => {
//   const testDataArr = [

//   ] as any;
//   return testDataArr;
// };

createCases(config.casesPath)
  .then((cases) => createCasesTypes(config, cases))
  .catch(console.error);
