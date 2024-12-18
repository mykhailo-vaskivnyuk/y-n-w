import assert from 'node:assert';
import { TTestUnit } from '../../types/types';

export const tMember =
  (m: number): TTestUnit =>
  (state) => ({
    title: `invite create for tree[${m}]`,
    operations: [
      {
        name: '/member/invite/create',
        params: () => ({
          node_id: state.net.node_id,
          member_node_id: state.tree[m].node_id,
          member_name: `member ${m}`,
        }),
        expected: (actual) => assert.equal(actual.length > 10, true),
        setToState: (actual) => (state.global.invite = actual),
      },
    ],
  });
