import {
  IMessage,
  MessageTypeKeys,
} from '../../client/common/server/types/messages.types';

export interface ILinkConfig {
  path: string;
}

export interface ILinkConnection {
  onMessage: <T extends MessageTypeKeys>(data: IMessage<T>) => void;
}
