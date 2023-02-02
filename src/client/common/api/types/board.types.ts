import { ITableUsersBoardMessages } from '../../../local/imports';

export type INetBoardReadResponse = ITableUsersBoardMessages[]

export type IBoardRemoveParams = {
  node_id: number,
  message_id: number,
};

export type IBoardSaveParams = {
  node_id: number,
  message_id?: number,
  message: string,
};
