/* eslint-disable max-lines */
/* eslint-disable max-len */
import { TTestCase } from './types';

export interface ITestCasesTree {
  'account': {
    'login': {
      'login': TTestCase;
    };
  };
  'net': {
    'create': TTestCase;
  };
}
