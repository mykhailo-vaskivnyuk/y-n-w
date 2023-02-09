/* eslint-disable import/no-cycle */
import { IBoardSaveParams } from '../../server/types/types';
import { IClientAppThis } from '../types';
import { AppStatus } from '../constants';

export const getNetBoardMethods = (parent: IClientAppThis) => ({
  async persist(args: Omit<IBoardSaveParams, 'node_id'>) {
    parent.setStatus(AppStatus.LOADING);
    try {
      const { net } = parent.getState();
      const { node_id: nodeId } = net!;
      const { message_id: messageId, message } = args;
      let success = false;
      if (!message) {
        if (!messageId) success = true;
        else { 
          success = await parent.api.net.board
            .remove({ message_id: messageId, node_id: nodeId });
        }
      } else {
        success = await parent.api.net.board
          .save({ ...args, node_id: nodeId });
      }
      parent.setStatus(AppStatus.READY);
      return success;
    } catch (e: any) {
      parent.setError(e);
      return false;
    }
  },

  async read() {
    const { net } = parent.getState();
    const { node_id: nodeId } = net!;
    const messages = await parent.api.net.board.read({ node_id: nodeId });
    parent.setBoardMessages(messages);
  },
});
