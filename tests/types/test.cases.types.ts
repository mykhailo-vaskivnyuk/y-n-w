/* eslint-disable max-lines */
/* eslint-disable max-len */
import { TTestCase } from './types';

export interface ITestCasesTree {
  'account': {
    'login': {
      'user01': TTestCase;
      'user02': TTestCase;
      'user03': TTestCase;
    };
  };
  'chat': {
    'message': {
      'sendFirst': TTestCase;
      'sendSecond': TTestCase;
      'sendThird': TTestCase;
      'receiveSecond': TTestCase;
      'receiveFirst': TTestCase;
    };
  };
  'events': {
    'vote': TTestCase;
  };
  'invite': {
    'create': TTestCase;
  };
  'net': {
    'create': {
      'first': TTestCase;
      'second': TTestCase;
    };
    'enter': {
      'firstNet': TTestCase;
    };
  };
  'vote': {
    'set': TTestCase;
  };
}
