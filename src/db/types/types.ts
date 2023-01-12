import { DbRecordOrNull } from '../../client/common/types';
import {
  ITableNodes, ITableNetsUsersData, ITableUsersNodesInvites,
} from '../db.types';

export type INodeWithUser =
  ITableNodes &
  DbRecordOrNull<Pick<ITableUsersNodesInvites, 'token'>> &
  DbRecordOrNull<Pick<ITableNetsUsersData, 'user_id' | 'confirmed'>>;
