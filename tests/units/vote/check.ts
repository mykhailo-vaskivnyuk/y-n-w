import assert from 'node:assert';
import { IOperationData, TTestUnit } from '../../types/types';

export const self: TTestUnit = (state: any) => ({
  title: 'Check votes',
  operations: [
    {
      name: '/net/getTree',
      params: { node_id: state.net.parent_node_id },
      expected: (actual) => {
        for (const mber of actual) {
          if (mber.node_id === state.net.node_id) continue;
          const available = (state.circle as Array<any>).find(
            (m) => m.node_id === mber.node_id,
          );
          assert(Boolean(available));
        }
      },
    },
  ] as IOperationData[],
});
