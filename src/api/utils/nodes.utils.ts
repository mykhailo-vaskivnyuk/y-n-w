import { MAX_NODE_LEVEL } from '../../client/common/server/constants';
import { ITableNodes } from '../../domain/types/db.tables.types';
import { ITransaction } from '../../db/types/types';

export const createTree = async (t: ITransaction, node: ITableNodes) => {
  const { node_level, node_id, net_id } = node;
  if (node_level >= MAX_NODE_LEVEL) return;
  await t.execQuery.node.tree.create([node_level + 1, node_id, net_id]);
};
