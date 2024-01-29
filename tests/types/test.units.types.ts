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
  'dislike': {
    'set': {
      'tMember': (...args: any[]) => TTestUnit;
      'cMember': (...args: any[]) => TTestUnit;
    };
    'setFinal': {
      'tMember': (...args: any[]) => TTestUnit;
      'cMember': (...args: any[]) => TTestUnit;
    };
  };
  'events': {
    'check': {
      'confirmed': TTestUnit;
    };
    'newEvents': TTestUnit;
    'vote': {
      'set': TTestUnit;
    };
    'read': {
      'disconnect': {
        'dislike': TTestUnit;
      };
      'voteForMembers': TTestUnit;
      'voteForMembersInTree': TTestUnit;
      'voteForMembersInCircle': TTestUnit;
      'voteForConnectedInCircle': TTestUnit;
      'voteForConnectedInTree': TTestUnit;
      'voteForVoteMember': TTestUnit;
      'voteForDisvoteMember': TTestUnit;
      'leave': {
        'dislikeInTree': TTestUnit;
        'dislikeInCircle': TTestUnit;
        'inTree': TTestUnit;
        'inCircle': TTestUnit;
      };
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
    'connectByToken': {
      'toNet': (...args: any[]) => TTestUnit;
    };
    'create': {
      'root2': TTestUnit;
      'first': TTestUnit;
      'second': TTestUnit;
    };
    'enter': (...args: any[]) => TTestUnit;
    'get': {
      'structure': (...args: any[]) => TTestUnit;
    };
    'leave': TTestUnit;
  };
  'user': {
    'update': {
      'all': (...args: any[]) => TTestUnit;
      'password': TTestUnit;
    };
  };
  'vote': {
    'check': {
      'self': TTestUnit;
    };
    'set': {
      'self': TTestUnit;
      'cMember': (...args: any[]) => TTestUnit;
    };
    'setFinal': {
      'self': TTestUnit;
      'cMember': (...args: any[]) => TTestUnit;
    };
  };
}
