import { IMember } from '../../../db/types/member.types';
import { NetEvent } from '../../../services/event/event';
import { createMessagesInTree } from './event.messages.tree';
import { createMessagesInCircle } from './event.messages.circle';
import { createInstantMessageInNet } from './event.messages.other';
import { createMessageToMember } from './event.messages.other';

/**
 * voteNetUser
 * removeMemberFromNetAndSubnets
 * api.net.board.save
 * api.net.board.remove
 * api.net.board.clear
 * api.member.data.vote.set
 * api.member.data.vote.unset
 * tighten net
 */

/*
createMessagesInTree
  execQuery.events.create
  commitEvents(user_id, date)
createMessagesInCircle
  createMessageToFacilitator
  cretaeMessagesToCircleMember
    sendInstantMessage
    execQuery.events.create
    commitEvents(user_id, date)
    execQuery.events.create
    commitEvents(user_id, date)
createMessageToMember
  execQuery.events.create
  commitEvents(user_id, date)
createInstantMessageInNet
  sendInstantMessageInNet
*/

export const createEventMessages = async (
  event: NetEvent,
  from: IMember,
) => {
  await createMessagesInCircle(event, from);
  await createMessagesInTree(event, from);
  await createMessageToMember(event, from);
  createInstantMessageInNet(event, from);
};
