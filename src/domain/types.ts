import { NetEvent } from './event/event';
// import { EventMessages } from './event/event.messages';
import {
  createNet, removeMemberFromNet, removeMemberFromAllNets,
} from './net/net';
import { NetArrange } from './net/net.arrange';
import * as member from './member/member';
import * as nodesUtils from './utils/nodes.utils';
import * as comUtils from './utils/utils';

export interface IDomain {
  net: {
    createNet: typeof createNet;
    removeMemberFromNet: typeof removeMemberFromNet;
    removeMemberFromAllNets: typeof removeMemberFromAllNets;
    NetArrange: typeof NetArrange;
  };
  event: {
    NetEvent: typeof NetEvent;
    // EventMessages: typeof EventMessages;
  };
  member: typeof member;
  utils: typeof nodesUtils & typeof comUtils,
}
