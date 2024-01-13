import { TTestUnit } from '../../types/types';

export const firstNet: TTestUnit = (state: any) => (
  {
    title: 'enter net 1',
    operations: [
      {
        name: '/net/enter',
        params: { net_id: 1 },
        setToState: (actual) => {
          state.net_id = actual.net_id;
          state.node_id = actual.node_id;
        },
      },
    ]
  });
