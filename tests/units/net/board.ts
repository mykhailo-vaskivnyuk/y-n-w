import { TTestUnit } from '../../types/types';

export const write: TTestUnit = (state: any) => ({
  title: `write board message in net: ${state.net.net_id}`,
  operations: [
    {
      name: '/net/board/save',
      params: { node_id: state.net.node_id, message: 'board message' },
    },
  ],
});
