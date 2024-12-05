import {
  IEventMessage,
  INewEventsMessage,
} from '../../client/common/server/types/types';

export interface IMeesageStream {
  user_id?: number;
  net_id?: number;
  connectionIds: Set<number>;
  message: INewEventsMessage | IEventMessage;
}
