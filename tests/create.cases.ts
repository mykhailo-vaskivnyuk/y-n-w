import { createCases } from './utils/create.cases';
import { config } from './config';
import { createCasesTypes } from './utils/create.cases.types';

createCases(config.casesPath)
  .then((cases) => createCasesTypes(config, cases))
  .catch(console.error);
