import assert from 'node:assert';
import { IOperationData, TTestUnit } from '../../types/types';

export const self: TTestUnit = (state: any) => (
  {
    title: 'Unset vote for self',
    operations: [
      {
        name: '/member/data/vote/unSet',
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
