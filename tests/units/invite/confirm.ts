import { TTestUnit } from '../../types/types';

export const tMember = (m: number): TTestUnit => (state) => (
  {
    title: `invite confirm tree[${m}]`,
    operations: [
      {
        name: '/member/invite/confirm',
        params: () => ({
          node_id: state.net.node_id,
          member_node_id: state.tree[m].node_id,
        }),
        expected: true,
      },
    ],
  });
