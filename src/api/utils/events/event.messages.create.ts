import { IMember } from '../../../db/types/member.types';
import { NetEventKeys } from '../../../client/common/server/types/types';
import { createMessagesInTree } from './event.messages.tree';
import { createMessagesInCircle } from './event.messages.circle';
import { createInstantMessageInNet } from './event.messages.instant';
import { createMessageToMember } from './event.messages.other';

/**
 * voteNetUser
 * removeNetUser
 * api.net.board.save
 * api.net.board.remove
 * api.net.board.clear
 * api.member.data.vote.set
 * api.member.data.vote.unset
 * tighten net
 */

export const createEventMessages = async (
  event: NetEventKeys,
  fromMember: IMember,
  eventDate?: string,
) => {
  const date = eventDate || new Date().toUTCString();
  await createMessagesInTree(event, fromMember, date);
  await createMessagesInCircle(event, fromMember, date);
  createMessageToMember(event, fromMember, date);
  createInstantMessageInNet(event, fromMember, date);
};
