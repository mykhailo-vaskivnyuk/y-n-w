/* eslint-disable max-lines */
import { IOperationData, TTestUnit } from '../../types/types';

export const user01: TTestUnit = (state: any) => (
  {
    title: 'login',
    operations: [
      {
        name: '/health',
        params: {},
        expected: 'API IS READY',
      },
      {
        name: '/account/login',
        params: { email: 'user01@gmail.com', password: '12345' },
        expected: {
          email: 'user01@gmail.com',
          mobile: null,
          name: null,
          user_id: 1,
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

export const user02: TTestUnit = (state: any) => (
  {
    title: 'login',
    operations: [
      {
        name: '/health',
        params: {},
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

export const user03: TTestUnit = (state: any) => (
  {
    title: 'login',
    operations: [
      {
        name: '/health',
        params: {},
        expected: 'API IS READY',
      },
      {
        name: '/account/login',
        params: { email: 'user03@gmail.com', password: '12345' },
        expected: {
          email: 'user03@gmail.com',
          mobile: null,
          name: null,
          user_id: 3,
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
