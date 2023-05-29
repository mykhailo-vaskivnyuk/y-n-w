import { IOperationData, TTestCase } from '../../types/types';

export const login: TTestCase = (state) => (
  {
    task: 'login',
    operations: [
      {
        name: 'health',
        params: { value: state.value || null },
        response: 'API IS READY',
      },
      {
        name: 'account/login',
        params: { email: 'user02@gmail.com', password: '12345' },
        response: {
          email: 'user02@gmail.com',
          mobile: null,
          name: null,
          user_id: 2,
          user_status: 'LOGGEDIN',
        },
      },
    ] as IOperationData[],
  });
