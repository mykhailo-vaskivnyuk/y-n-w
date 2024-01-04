import { NetEvent } from './event/event';
import {
  createNet, removeMemberFromAllNets,
} from './net/net';
import { NetArrange } from './net/net.arrange';
import * as member from './member/member';
import * as nodesUtils from './utils/nodes.utils';
import * as comUtils from './utils/utils';

export interface IDomain {
  net: {
    createNet: typeof createNet;
    removeMemberFromAllNets: typeof removeMemberFromAllNets;
    NetArrange: typeof NetArrange;
  };
  event: {
    NetEvent: typeof NetEvent;
  };
  member: typeof member;
  utils: typeof nodesUtils & typeof comUtils,
}
