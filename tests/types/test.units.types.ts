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
    'instant': {
      'vote': TTestUnit;
    };
    'newEvents': TTestUnit;
    'read': {
      'disconnect': {
        'dislike': TTestUnit;
        'dislikeFacilitator': TTestUnit;
        'leaveFacilitator': TTestUnit;
      };
      'getEvent': (...args: any[]) => TTestUnit;
      'confirm': TTestUnit;
      'confirmInCircle': TTestUnit;
      'connect': TTestUnit;
      'connectAndConfirmInTree': TTestUnit;
      'connectAndConfirmInCircle': TTestUnit;
      'boardMessage': TTestUnit;
      'tightenInTree': TTestUnit;
      'tighten': TTestUnit;
      'leave': {
        'dislikeInTree': TTestUnit;
        'dislikeInCircle': TTestUnit;
        'dislikeFacilitator': TTestUnit;
        'leaveFacilitator': TTestUnit;
        'inTree': TTestUnit;
        'inCircle': TTestUnit;
      };
      'vote': {
        'forMembers': TTestUnit;
        'forMembersInTree': TTestUnit;
        'forMembersInCircle': TTestUnit;
        'forConnectedInCircle': TTestUnit;
        'forConnectedInTree': TTestUnit;
        'forVoteMember': TTestUnit;
        'forDisvoteMember': TTestUnit;
        'forFacilitator': TTestUnit;
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
    'board': {
      'write': TTestUnit;
    };
    'connectByToken': {
      'toNet': (...args: any[]) => TTestUnit;
      'withErrorToNet': (...args: any[]) => TTestUnit;
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
    'unSet': {
      'self': TTestUnit;
    };
  };
}
