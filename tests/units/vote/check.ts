import assert from 'node:assert';
import { IOperationData, TTestUnit } from '../../types/types';

export const self: TTestUnit = (state: any) => (
  {
    title: 'Check votes',
    operations: [
      {
        name: '/net/getTree',
        params: { node_id: state.node_id },
        expected: (actual) => {
          const mbers = actual.filter(({ node_id }: any) => node_id === 1);
          assert(mbers.length === 1);
          assert(mbers[0].node_id === 1);
        },
      },
    ] as IOperationData[],
  });
