import { TTestUnit } from '../../types/types';

const unit: TTestUnit = (state: any) => (
  {
    title: 'connect net by token',
    operations: [
      {
        name: '/net/connectByToken',
        params: { token: state.global.invite },
        expected: { net_id: 1 },
      },
    ],
  });

  export = unit;
