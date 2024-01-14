import { TTestUnit } from '../../types/types';

const mber = (m: number): TTestUnit => (state) => (
  {
    title: `invite confirm tree[${m}]`,
    operations: [
      {
        name: '/member/invite/confirm',
        params: () => ({
          node_id: state.node_id,
          member_node_id: state.tree[m].node_id,
        }),
        expected: true,
      },
    ],
  });

export const mber0 = mber(0);
export const mber2 = mber(2);
export const mber4 = mber(4);
export const mber5 = mber(5);
