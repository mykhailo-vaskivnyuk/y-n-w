import { ITableUsersMessages } from '../../../local/imports';
import { OmitNull } from '../../types';
import { IChatResponseMessage } from './chat.types';

export type IUserChange = ITableUsersMessages;
export type IUserChanges = IUserChange[];

export type IInstantChange =
  OmitNull<IChatResponseMessage> &
  Omit<IUserChange, 'message' | 'date'>;
