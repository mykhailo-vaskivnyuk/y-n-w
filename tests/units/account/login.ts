import { IOperationData, TTestUnit } from '../../types/types';

export const user = (id: number): TTestUnit => (state: any) => (
  {
    title: `login user ${id}`,
    operations: [
      {
        name: '/health',
        params: {},
        expected: 'API IS READY',
      },
      {
        name: '/account/login',
        params: {
          email: `user${String(id).padStart(2, '0')}@gmail.com`,
          password: '12345',
        },
        expected: {
          email: `user${String(id).padStart(2, '0')}@gmail.com`,
          mobile: null,
          name: null,
          user_id: id,
          user_status: 'LOGGEDIN',
          chat_id: null,
        },
        setToState: (actual) => state.user_id = actual.user_id,
      },
      {
        name: '/chat/connect/user',
        params: {},
      },
      {
        name: '/chat/connect/nets',
        params: {},
        setToState: (actual) => {
          state.chats || (state.chats = {});
          actual.forEach((net: any) => state.chats[net.net_id] = net);
        },
      }
    ] as IOperationData[],
  });
