import { ITableBoardMessages } from '../../../local/imports';

export type INetBoardReadResponse = ITableBoardMessages[]

export type IBoardRemoveParams = {
  node_id: number,
  message_id: number,
};

export type IBoardSaveParams = {
  node_id: number,
  message_id?: number,
  message: string,
};
