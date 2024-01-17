import assert from 'node:assert';
import { TTestUnit } from '../../types/types';

const mber = (m: number): TTestUnit => (state) => (
  {
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
        setToState: (actual) => state.global.invite = actual,
      },
    ],
  });

export const mber0 = mber(0);
export const mber2 = mber(2);
export const mber4 = mber(4);
