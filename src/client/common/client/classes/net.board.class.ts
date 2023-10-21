/* eslint-disable import/no-cycle */
import { IBoardSaveParams } from '../../server/types/types';
import { IClientAppThis } from '../types';
import { AppStatus } from '../constants';
import { ITableBoardMessages } from '../../../local/imports';

type IApp = IClientAppThis;

export class NetBoard {
  private boardMessages: ITableBoardMessages[];

  constructor(private app: IApp) {}

  getState() {
    return this.boardMessages;
  }

  private setBoardMessages(messages: ITableBoardMessages[] = []) {
    this.boardMessages = messages;
  }

  async persist(args: Omit<IBoardSaveParams, 'node_id'>) {
    try {
      await this.app.setStatus(AppStatus.LOADING);
      const { net } = this.app.getState();
      const { node_id: nodeId } = net!;
      const { message_id: messageId, message } = args;
      let success = false;
      if (!message) {
        if (!messageId) success = true;
        else {
          success = await this.app.api.net.board
            .remove({ message_id: messageId, node_id: nodeId });
        }
      } else {
        success = await this.app.api.net.board
          .save({ ...args, node_id: nodeId });
      }
      this.app.setStatus(AppStatus.READY);
      return success;
    } catch (e: any) {
      this.app.setError(e);
      return false;
    }
  }

  async read() {
    const { net } = this.app.getState();
    const { node_id: nodeId } = net!;
    const messages = await this.app.api.net.board.read({ node_id: nodeId });
    this.setBoardMessages(messages);
  }
}
