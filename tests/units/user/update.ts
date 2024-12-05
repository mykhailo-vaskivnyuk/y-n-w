import { IOperationData, TTestUnit } from '../../types/types';

const getUnit =
  (user: Record<string, any>): TTestUnit =>
  (state: any) => ({
    title: 'update user data',
    operations: [
      {
        name: '/user/update',
        params: {
          ...state.user,
          ...user,
        },
        expected: {
          ...state.user,
        },
      },
    ] as IOperationData[],
  });

export const all = getUnit;
export const password = getUnit({ password: '12345' });
