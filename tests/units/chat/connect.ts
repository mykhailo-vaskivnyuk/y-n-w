import { TTestUnit } from '../../types/types';

const unit: TTestUnit = (state: any) => ({
  title: `chat connect user ${state.user_id}`,
  operations: [
    {
      name: '/chat/connect/user',
      params: {},
    },
    {
      name: '/chat/connect/nets',
      params: {},
      setToState: (actual) => {
        state.chats || (state.chats = {});
        actual.forEach((net: any) => (state.chats[net.net_id] = net));
      },
    },
  ],
});

export = unit;
