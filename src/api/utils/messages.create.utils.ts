import { ITableNetsData } from '../../db/types/db.tables.types';
import { IMember } from '../../db/types/member.types';
import { NetEventKeys } from '../types/net.types';
import { createMessagesInTree } from './messages.tree.utils';
import { createMessagesInCircle } from './messages.circle.utils';
import { createMessagesInNet, createMessageToMember } from './messages.utils';

export const createMessages = async (
  event: NetEventKeys,
  memberNet: IMember & Pick<ITableNetsData, 'name'>,
  eventDate?: string,
) => {
  const date = eventDate || new Date().toUTCString();
  await createMessagesInTree(event, memberNet, date);
  await createMessagesInCircle(event, memberNet, date);
  createMessageToMember(event, memberNet, date);
  createMessagesInNet(event, memberNet);
};
