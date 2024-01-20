import { ITableNets } from '../types/db.types';
import { INetMember } from '../types/member.types';
import { INetNode } from '../types/net.types';
import { createTree } from '../utils/nodes.utils';
import { exeWithNetLock } from '../utils/utils';
import { NetArrange } from './net.arrange';

export const createNet = (
  user_id: number,
  parentNetId: number | null,
  name: string,
) => exeWithNetLock(parentNetId, async (t) => {
  /* create net */
  let net: ITableNets | undefined;
  if (parentNetId) {
    [net] = await t.execQuery.net.createChild([parentNetId]);
    await new domain.net.NetArrange().updateCountOfNets(t, parentNetId);
  } else {
    [net] = await execQuery.net.createRoot([]);
    const { net_id: root_net_id } = net!;
    [net] = await execQuery.net.setRootNet([root_net_id]);
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
});

export const removeMemberFromAllNets = async (user_id: number) => {
  const userNetDataArr = await execQuery.user.nets.getTop([user_id]);
  const net = new NetArrange();
  for (const userNetData of userNetDataArr) {
    await net.removeMemberFromNet('LEAVE', userNetData);
  }
};

export const showNet = (netNode: INetNode) => {
  const { member, tree } = netNode;
  const {
    node_level: level,
    node_id,
    user_id,
    invite,
    dislikes,
    votes,
  } = member;

  let before = level > 1 ? ' '.concat('| '.repeat(level - 1)) : '';
  before += level ? ' |-' : '';

  const strNode = String(node_id).padStart(2, ' ');
  const strUser = user_id ? `:${user_id}` : '';
  const strInvite = invite ? ':i' : '';
  const strDislikes = dislikes ? `-${dislikes}d` : '';
  const strVotes = votes ? `-${votes}v` : '';
  const log = before
    .concat(strNode)
    .concat(strUser)
    .concat(strInvite)
    .concat(strDislikes)
    .concat(strVotes);
  console.log(log);

  tree?.forEach(showNet);
};

export const getNetNode = async (member: INetMember) => {
  const tree = await execQuery.net.structure.get.tree([member.node_id]);
  if (!tree.length) return { member, tree: null };
  const arr: INetNode[] = [];
  for (const member of tree) arr.push(await getNetNode(member));
  return { member, tree: arr };
};
