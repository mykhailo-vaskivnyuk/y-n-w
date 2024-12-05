import { TTestUnit } from '../../types/types';

export const toNet =
  (net_id: number): TTestUnit =>
  (state: any) => ({
    title: 'connect net by token',
    operations: [
      {
        name: '/net/connectByToken',
        params: { token: state.global.invite },
        expected: { net_id },
      },
    ],
  });

export const withErrorToNet =
  (net_id: number): TTestUnit =>
  (state: any) => ({
    title: 'connect net by token with error',
    operations: [
      {
        name: '/net/connectByToken',
        params: { token: state.global.invite },
        expected: { net_id, error: 'already connected' },
      },
    ],
  });
