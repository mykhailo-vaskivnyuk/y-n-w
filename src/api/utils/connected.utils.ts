import { NetEvent } from '../../services/event/event';

export const removeConnectedMember = async (
  event: NetEvent,
  user_id: number,
) => {
  const { net_id } = event;
  await execQuery.member.remove([user_id, net_id]);
  await event.messages.createToConnected(user_id);
};

export const removeConnectedAll = async (event: NetEvent) => {
  const { node_id } = event.member!;
  const users = await execQuery.member.getConnected([node_id]);
  for (const { user_id } of users) {
    await removeConnectedMember(event, user_id);
  }
};
