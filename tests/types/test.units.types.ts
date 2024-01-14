/* eslint-disable max-lines */
/* eslint-disable max-len */
import { TTestUnit } from './types';

export interface ITestUnitsMap {
  'account': {
    'login': {
      'user01': TTestUnit;
      'user02': TTestUnit;
      'user03': TTestUnit;
      'user04': TTestUnit;
    };
    'signup': {
      'user05': TTestUnit;
      'user06': TTestUnit;
      'user07': TTestUnit;
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
    'confirm': {
      'mber0': TTestUnit;
      'mber2': TTestUnit;
      'mber4': TTestUnit;
      'mber5': TTestUnit;
    };
    'create': {
      'mber0': TTestUnit;
      'mber2': TTestUnit;
      'mber4': TTestUnit;
    };
  };
  'net': {
    'connetByToken': TTestUnit;
    'create': {
      'first': TTestUnit;
      'second': TTestUnit;
    };
    'enter': {
      'firstNet': TTestUnit;
    };
    'leave': TTestUnit;
  };
  'vote': {
    'check': {
      'self': TTestUnit;
    };
    'set': {
      'self': TTestUnit;
      'mber1': TTestUnit;
      'mber2': TTestUnit;
      'mber3': TTestUnit;
      'mber4': TTestUnit;
      'mber5': TTestUnit;
    };
  };
}
