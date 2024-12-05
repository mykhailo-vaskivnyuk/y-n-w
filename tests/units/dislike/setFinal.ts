import assert from 'node:assert';
import { IOperationData, TTestUnit } from '../../types/types';

export const tMember =
  (m: number): TTestUnit =>
  (state: any) => ({
    title: `Set dislike for tree[${m}]`,
    operations: [
      {
        name: '/member/data/dislike/set',
        params: {
          node_id: state.net.node_id,
          member_node_id: state.tree[m].node_id,
        },
        expected: true,
      },
      {
        name: '/net/getTree',
        params: { node_id: state.net.node_id },
        expected: (actual) => {
          assert.strictEqual(actual[m].user_id, null);
        },
      },
    ] as IOperationData[],
  });

export const cMember =
  (m: number): TTestUnit =>
  (state: any) => ({
    title: `Set dislike for circle[${m}]`,
    operations: [
      {
        name: '/member/data/dislike/set',
        params: {
          node_id: state.net.node_id,
          member_node_id: state.circle[m].node_id,
        },
        expected: true,
      },
      {
        name: '/net/getCircle',
        params: { node_id: state.net.node_id },
        expected: (actual) => {
          assert.strictEqual(actual[m].user_id, null);
        },
      },
    ] as IOperationData[],
  });
