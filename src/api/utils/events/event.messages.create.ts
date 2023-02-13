import { ITableNetsData } from '../../../db/types/db.tables.types';
import { IMember } from '../../../db/types/member.types';
import { NetEventKeys } from '../../types/net.types';
import { createMessagesInTree } from './event.messages.tree';
import { createMessagesInCircle } from './event.messages.circle';
import { createInstantMessageInNet } from './event.messages.instant';
import { createMessageToMember } from './event.messages.other';

/**
 * voteNetUser
 * removeNetUser
 * api.net.board.save
 * api.net.board.remove
 * api.member.data.vote.set
 * api.member.data.vote.unset
 */

export const createEventMessages = async (
  event: NetEventKeys,
  fromMember: IMember & Pick<ITableNetsData, 'name'>,
  eventDate?: string,
) => {
  const date = eventDate || new Date().toUTCString();
  await createMessagesInTree(event, fromMember, date);
  await createMessagesInCircle(event, fromMember, date);
  createMessageToMember(event, fromMember, date);
  createInstantMessageInNet(event, fromMember);
};
