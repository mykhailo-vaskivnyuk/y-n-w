import { IOperationData, TTestUnit } from '../../types/types';

const user = (user: number): TTestUnit => (state: any) => (
  {
    title: `signup user ${user}`,
    operations: [
      {
        name: '/health',
        params: {},
        expected: 'API IS READY',
      },
      {
        name: '/account/signup',
        params: { email: `user${String(user).padStart(2, '0')}@gmail.com` },
        expected: {
          email: `user${String(user).padStart(2, '0')}@gmail.com`,
          mobile: null,
          name: null,
          user_id: user,
          user_status: 'LOGGEDIN',
          chat_id: null,
        },
        setToState: (actual) => state.user_id = actual.user_id,
      },
      {
        name: '/chat/connect/user',
        params: {},
      },
    ] as IOperationData[],
  });

export const user05 = user(5);
export const user06 = user(6);
export const user07 = user(7);