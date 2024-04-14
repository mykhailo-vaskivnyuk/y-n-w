import assert from 'node:assert';
import { IOperationData, TTestUnit } from '../../types/types';

export const user = (user: number): TTestUnit => (state: any) => (
  {
    title: `signup user ${user}`,
    operations: [
      {
        name: '/health',
        params: {},
        expected: 'API IS READY',
        setToState: () => Object
          .keys(state)
          .forEach((key) => key !== 'global' && delete state[key]),
      },
      {
        name: '/account/signup',
        params: {
          name: `Учасник ${user}`,
          email: `user${String(user).padStart(2, '0')}@gmail.com`,
        },
        expected: (actual) => assert.deepStrictEqual(actual, {
          email: `user${String(user).padStart(2, '0')}@gmail.com`,
          mobile: null,
          name: `Учасник ${user}`,
          user_id: actual.user_id,
          user_status: 'LOGGEDIN',
          chat_id: null,
        }),
        setToState: (actual) => state.user = actual,
      },
      {
        name: '/chat/connect/user',
        params: {},
      },
    ] as IOperationData[],
  });
