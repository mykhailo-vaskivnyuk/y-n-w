import assert from 'node:assert';
import { IOperationData, TTestUnit } from '../../types/types';

export const self: TTestUnit = (state: any) => ({
  title: 'Set final vote for self',
  operations: [
    {
      name: '/member/data/vote/set',
      params: {
        node_id: state.net.node_id,
        member_node_id: state.net.node_id,
      },
      expected: true,
    },
    {
      name: '/user/net/getData',
      params: { net_id: state.net.net_id },
      expected: (actual) => {
        assert.strictEqual(false, actual.vote);
      },
    },
  ] as IOperationData[],
});

export const cMember =
  (m: number): TTestUnit =>
  (state: any) => ({
    title: `Set final vote for circle[${m}]`,
    operations: [
      {
        name: '/member/data/vote/set',
        params: {
          node_id: state.net.node_id,
          member_node_id: state.circle[m].node_id,
        },
      },
      {
        name: '/net/getCircle',
        params: { node_id: state.net.node_id },
        expected: (actual) => {
          const mbers = actual.filter(({ vote }: any) => vote);
          assert(mbers.length === 0);
        },
      },
    ] as IOperationData[],
  });
