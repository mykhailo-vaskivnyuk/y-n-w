import { TTestUnit } from '../../types/types';

const getUnit =
  (net_id: number): TTestUnit =>
  (state: any) => ({
    title: `enter net net_id: ${net_id}`,
    operations: [
      {
        name: '/net/enter',
        params: { net_id },
        setToState: (actual) => {
          state.net = actual;
        },
      },
      {
        name: '/net/getCircle',
        params: () => ({ node_id: state.net.node_id }),
        setToState: (actual) => (state.circle = actual),
      },
      {
        name: '/net/getTree',
        params: () => ({ node_id: state.net.node_id }),
        setToState: (actual) => (state.tree = actual),
      },
    ],
  });

export = getUnit;
