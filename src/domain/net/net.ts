import { ITransaction } from '../../db/types/types';
import { ITableNets, ITableNodes } from '../types/db.types';
import { INetMember } from '../types/member.types';
import { INetNode } from '../types/net.types';
import { MAX_NODE_LEVEL } from '../../client/common/server/constants';
import { NetArrange } from './net.arrange';

export const createTree = async (t: ITransaction, node: ITableNodes) => {
  const { node_level, node_id, net_id } = node;
  if (node_level >= MAX_NODE_LEVEL) return;
  await t.execQuery.node.tree.create([node_level + 1, node_id, net_id]);
};

export const createNet = async (
  user_id: number,
  parentNetId: number | null,
  name: string,
  t: ITransaction,
) => {
  /* create net */
  let net: ITableNets | undefined;
  if (parentNetId) {
    [net] = await t.execQuery.net.createChild([parentNetId]);
    await new domain.net.NetArrange(t).updateCountOfNets(parentNetId);
  } else {
    [net] = await t.execQuery.net.createRoot([]);
    const { net_id: root_net_id } = net!;
    [net] = await t.execQuery.net.setRootNet([root_net_id]);
  }
  const { net_id } = net!;

  /* create root node */
  const [node] = await t.execQuery.node.create([net_id]);
  const { node_id } = node!;

  /* create node tree */
  await createTree(t, node!);

  /* create net data */
  const [netData] = await t.execQuery.net.data.create([net_id, name]);

  /* create first member */
  await t.execQuery.member.create([node_id, user_id]);

  return { ...net!, ...netData!, ...node!, total_count_of_members: 1 };
};

export const removeMemberFromAllNets = async (user_id: number) => {
  const userNetDataArr = await execQuery.user.nets.getTop([user_id]);
  for (const userNetData of userNetDataArr) {
    await NetArrange.removeMemberFromNet('LEAVE', userNetData);
  }
};

export const showNet = (netNode: INetNode) => {
  const { member, tree, connection: conn } = netNode;
  const {
    node_level: level,
    node_id,
    user_id,
    confirmed,
    invite,
    dislikes,
    votes,
  } = member;
  const indent = '  |'.repeat(level).concat(conn ? '+' : '-');

  const strNode = String(node_id).padStart(2, ' ');
  const strInvite = invite ? ':!x' : '';
  const strConfirmed = confirmed ? '' : '!';
  const strUser = user_id ? `:${strConfirmed}${user_id}` : '';
  const strDislikes = dislikes ? `-${dislikes}d` : '';
  const strVotes = votes ? `-${votes}v` : '';
  const log = indent
    .concat(strNode)
    .concat(strInvite)
    .concat(strUser)
    .concat(strDislikes)
    .concat(strVotes);
  console.log(log);

  tree?.forEach(showNet);
};

export const getNetNode = async (member: INetMember) => {
  const { node_id, user_id } = member;
  const connections = user_id && chatService.getUserConnections(user_id);
  const connection = Boolean(connections);
  const tree = await execQuery.net.structure.get.tree([node_id]);
  if (!tree.length) return { member, tree: null, connection };
  const arr: INetNode[] = [];
  for (const member of tree) arr.push(await getNetNode(member));
  return { member, tree: arr, connection };
};
