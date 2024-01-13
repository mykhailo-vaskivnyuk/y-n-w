/* eslint-disable max-lines */
/* eslint-disable max-len */
import { TTestUnit } from './types';

export interface ITestUnitsMap {
  'account': {
    'login': {
      'user01': TTestUnit;
      'user02': TTestUnit;
      'user03': TTestUnit;
    };
  };
  'chat': {
    'message': {
      'sendFirst': TTestUnit;
      'sendSecond': TTestUnit;
      'sendThird': TTestUnit;
      'receiveSecond': TTestUnit;
      'receiveFirst': TTestUnit;
    };
  };
  'events': {
    'newEvents': TTestUnit;
    'read': {
      'leaveInTree': TTestUnit;
      'leaveInCircle': TTestUnit;
    };
    'vote': TTestUnit;
  };
  'invite': {
    'create': TTestUnit;
  };
  'net': {
    'create': {
      'first': TTestUnit;
      'second': TTestUnit;
    };
    'enter': {
      'firstNet': TTestUnit;
    };
    'leave': {
      'parent': TTestUnit;
    };
  };
  'vote': {
    'set': TTestUnit;
  };
}
