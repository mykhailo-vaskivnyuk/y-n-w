/* eslint-disable max-lines */
import { TTestUnit } from '../../types/types';

export const sendFirst: TTestUnit = (state: any) => ({
  title: 'send messages from first',
  operations: [
    {
      name: '/chat/sendMessage',
      params: () => ({
        node_id: state.net.node_id,
        chatId: state.chats[state.net.net_id].net,
        message: 'from first in net',
      }),
    },
    {
      name: 'receive in net back',
      expected: {
        chatId: 1,
        index: 1,
        message: 'from first in net',
        type: 'CHAT',
        user_id: 1,
      },
    },
    {
      name: '/chat/sendMessage',
      params: () => ({
        node_id: state.net.node_id,
        chatId: state.chats[state.net.net_id].tree,
        message: 'from first in tree',
      }),
    },
    {
      name: 'receive in tree back',
      expected: {
        chatId: 2,
        index: 1,
        message: 'from first in tree',
        type: 'CHAT',
        user_id: 1,
      },
    },
  ],
});

export const sendSecond: TTestUnit = (state: any) => ({
  title: 'receive and send messages from second',
  operations: [
    {
      name: 'receive in net from first',
      expected: {
        chatId: 1,
        index: 1,
        message: 'from first in net',
        type: 'CHAT',
        user_id: 1,
      },
    },
    {
      name: 'receive in tree from first',
      expected: {
        chatId: 2,
        index: 1,
        message: 'from first in tree',
        type: 'CHAT',
        user_id: 1,
      },
    },
    {
      name: '/chat/sendMessage',
      params: () => ({
        node_id: state.net.node_id,
        chatId: state.chats[state.net.net_id].net,
        message: 'from second in net',
      }),
    },
    {
      name: 'receive in net back',
      expected: {
        chatId: 1,
        index: 2,
        message: 'from second in net',
        type: 'CHAT',
        user_id: 2,
      },
    },
    {
      name: '/chat/sendMessage',
      params: () => ({
        node_id: state.net.node_id,
        chatId: state.chats[state.net.net_id].circle,
        message: 'from second in circle',
      }),
    },
    {
      name: 'receive in circle back',
      expected: {
        chatId: 2,
        index: 2,
        message: 'from second in circle',
        type: 'CHAT',
        user_id: 2,
      },
    },
    {
      name: '/chat/sendMessage',
      params: () => ({
        node_id: state.net.node_id,
        chatId: state.chats[state.net.net_id].tree,
        message: 'from second in tree',
      }),
    },
    {
      name: 'receive in tree back',
      expected: {
        chatId: 3,
        index: 1,
        message: 'from second in tree',
        type: 'CHAT',
        user_id: 2,
      },
    },
  ],
});

export const sendThird: TTestUnit = (state: any) => ({
  title: 'receive and send messages from third',
  operations: [
    {
      name: 'receive in net from first',
      expected: {
        chatId: 1,
        index: 1,
        message: 'from first in net',
        type: 'CHAT',
        user_id: 1,
      },
    },
    {
      name: 'receive in tree from first',
      expected: {
        chatId: 2,
        index: 1,
        message: 'from first in tree',
        type: 'CHAT',
        user_id: 1,
      },
    },
    {
      name: 'receive in net from second',
      expected: {
        chatId: 1,
        index: 2,
        message: 'from second in net',
        type: 'CHAT',
        user_id: 2,
      },
    },
    {
      name: 'receive in circle from second',
      expected: {
        chatId: 2,
        index: 2,
        message: 'from second in circle',
        type: 'CHAT',
        user_id: 2,
      },
    },
    {
      name: '/chat/sendMessage',
      params: () => ({
        node_id: state.net.node_id,
        chatId: state.chats[state.net.net_id].net,
        message: 'from third in net',
      }),
    },
    {
      name: 'receive in net back',
      expected: {
        chatId: 1,
        index: 3,
        message: 'from third in net',
        type: 'CHAT',
        user_id: 3,
      },
    },
    {
      name: '/chat/sendMessage',
      params: () => ({
        node_id: state.net.node_id,
        chatId: state.chats[state.net.net_id].circle,
        message: 'from third in circle',
      }),
    },
    {
      name: 'receive in circle back',
      expected: {
        chatId: 2,
        index: 3,
        message: 'from third in circle',
        type: 'CHAT',
        user_id: 3,
      },
    },
    {
      name: '/chat/sendMessage',
      params: () => ({
        node_id: state.net.node_id,
        chatId: state.chats[state.net.net_id].tree,
        message: 'from third in tree',
      }),
    },
    {
      name: 'receive in tree back',
      expected: {
        chatId: 4,
        index: 1,
        message: 'from third in tree',
        type: 'CHAT',
        user_id: 3,
      },
    },
  ],
});

export const receiveSecond: TTestUnit = () => ({
  title: 'receive message',
  operations: [
    {
      name: 'receive in net from third',
      expected: {
        chatId: 1,
        index: 3,
        message: 'from third in net',
        type: 'CHAT',
        user_id: 3,
      },
    },
    {
      name: 'receive in circle from third',
      expected: {
        chatId: 2,
        index: 3,
        message: 'from third in circle',
        type: 'CHAT',
        user_id: 3,
      },
    },
  ],
});

export const receiveFirst: TTestUnit = () => ({
  title: 'receive message',
  operations: [
    {
      name: 'receive in net from second',
      expected: {
        chatId: 1,
        index: 2,
        message: 'from second in net',
        type: 'CHAT',
        user_id: 2,
      },
    },
    {
      name: 'receive in tree from second',
      expected: {
        chatId: 2,
        index: 2,
        message: 'from second in circle',
        type: 'CHAT',
        user_id: 2,
      },
    },
    {
      name: 'receive in net from third',
      expected: {
        chatId: 1,
        index: 3,
        message: 'from third in net',
        type: 'CHAT',
        user_id: 3,
      },
    },
    {
      name: 'receive in tree from third',
      expected: {
        chatId: 2,
        index: 3,
        message: 'from third in circle',
        type: 'CHAT',
        user_id: 3,
      },
    },
  ],
});
