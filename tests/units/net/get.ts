import { TTestUnit } from '../../types/types';

export const structure =
  (net_id: number): TTestUnit =>
  () => ({
    title: `get net structure: ${net_id}`,
    operations: [
      {
        name: '/admin/net/get',
        params: { net_id },
      },
    ],
  });
