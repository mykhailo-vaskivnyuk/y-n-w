import { ITableNetsData } from '../../db/db.types';
import { IMember } from '../../db/types/member.types';
import { NetEventKeys } from '../types/net.types';
import { NET_MESSAGES_MAP } from '../../constants/constants';
import { createMessagesInTree } from './messages.tree.utils';
import { createMessagesInCircle } from './messages.circle.utils';
import { createMessageToMember } from './messages.utils';

export const createMessages = async (
  event: NetEventKeys,
  memberNet: IMember & Pick<ITableNetsData, 'name'>,
  date: string,
) => {
  await createMessagesInTree(event, memberNet, date);
  await createMessagesInCircle(event, memberNet, date);
  const messageToMember = NET_MESSAGES_MAP[event]['MEMBER'];
  if (messageToMember) await createMessageToMember(event, memberNet, date);
};
