import { IOperationData, TTestCase } from '../../types/types';

export const login: TTestCase = () => (
  {
    title: 'login',
    operations: [
      {
        name: '/health',
        expected: 'API IS READY',
      },
      {
        name: '/account/login',
        params: { email: 'user02@gmail.com', password: '12345' },
        expected: {
          email: 'user02@gmail.com',
          mobile: null,
          name: null,
          user_id: 2,
          user_status: 'LOGGEDIN',
        },
      },
    ] as IOperationData[],
  });
