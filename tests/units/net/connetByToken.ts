import { TTestUnit } from '../../types/types';

const getUnit = (net_id: number): TTestUnit => (state: any) => (
  {
    title: 'connect net by token',
    operations: [
      {
        name: '/net/connectByToken',
        params: { token: state.global.invite },
        expected: { net_id },
      },
    ],
  });

  export = getUnit;
