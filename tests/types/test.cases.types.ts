/* eslint-disable max-lines */
/* eslint-disable max-len */
import { TTestCase } from './types';

export interface ITestCasesTree {
  'account': {
    'login': {
      'user02': TTestCase;
      'user03': TTestCase;
    };
  };
  'invite': {
    'connect': TTestCase;
    'create': TTestCase;
  };
  'net': {
    'create': {
      'first': TTestCase;
      'second': TTestCase;
    };
  };
}
