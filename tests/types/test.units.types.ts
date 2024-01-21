/* eslint-disable max-lines */
/* eslint-disable max-len */
import { TTestUnit } from './types';

export interface ITestUnitsMap {
  'account': {
    'login': {
      'user': (...args: any[]) => TTestUnit;
    };
    'signup': {
      'user': (...args: any[]) => TTestUnit;
    };
  };
  'chat': {
    'connect': TTestUnit;
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
      'voteForMembers': TTestUnit;
      'voteForVoteMember': TTestUnit;
      'voteForDisvoteMember': TTestUnit;
    };
    'vote': {
      'set': TTestUnit;
    };
  };
  'invite': {
    'confirm': {
      'tMember': (...args: any[]) => TTestUnit;
    };
    'create': {
      'tMember': (...args: any[]) => TTestUnit;
    };
  };
  'net': {
    'connetByToken': TTestUnit;
    'create': {
      'first': TTestUnit;
      'second': TTestUnit;
    };
    'enter': (...args: any[]) => TTestUnit;
    'leave': TTestUnit;
  };
  'vote': {
    'check': {
      'self': TTestUnit;
    };
    'set': {
      'self': TTestUnit;
      'cMember': (...args: any[]) => TTestUnit;
    };
  };
}
