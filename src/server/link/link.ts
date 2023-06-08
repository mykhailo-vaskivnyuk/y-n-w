import { THandleOperation } from '../../types/operation.types';
import {
  IMessage, MessageTypeKeys,
} from '../../client/common/server/types/messages.types';
import { IInputConnection, IServer } from '../types';
import { ILinkConnection } from './types';
import { MAX_CHAT_INDEX } from '../../constants/constants';
import { createUnicCode } from '../../utils/crypto';
import { excludeNullUndefined } from '../../utils/utils';

class LinkConnection implements IInputConnection {
  private static exec?: THandleOperation;
  private static counter = 0;
  private static connections = new Map<number, ILinkConnection>();

  static getClient(onMessage: ILinkConnection['onMessage']) {
    const connection = { onMessage };
    const sessionKey = createUnicCode(10);
    const connectionId = LinkConnection.getConnectionId(connection);

    const handleRequest = (
      name: string,
      params: Record<string, any> = {},
    ): Promise<any> => LinkConnection.exec!({
      options: {
        sessionKey,
        origin: 'localhost',
        connectionId,
      },
      names: name.split('/').filter(Boolean),
      data: { params },
    });
    return handleRequest;
  }

  onOperation(cb: THandleOperation) {
    LinkConnection.exec = cb;
  }

  setUnavailable() {
    return;
  }

  getServer() {
    return {} as IServer;
  }

  async start() {
    return;
  }

  async stop() {
    return;
  }

  private static getConnectionId(connection: ILinkConnection) {
    const { counter, connections } = LinkConnection;
    const connectionId = (counter % MAX_CHAT_INDEX) + 1;
    LinkConnection.counter = connectionId;
    connections.set(connectionId, connection);
    return connectionId;
  }

  private static getConnection(connectionId: number) {
    return LinkConnection.connections.get(connectionId);
  }

  private static sendMessage<T extends MessageTypeKeys>(
    data: IMessage<T>, connectionIds?: Set<number>,
  ) {
    if (!connectionIds) return false;
    try {
      [...connectionIds]
        .map((connectionId) => LinkConnection.getConnection(connectionId))
        .filter(excludeNullUndefined)
        .forEach((connection) => connection.onMessage(data));
      return true;
    } catch (e) {
      logger.error(e);
      return false;
    }
  }

  getConnectionService() {
    return {
      sendMessage: LinkConnection.sendMessage,
    };
  }
}

export = LinkConnection;
