import { ITableEvents } from '../../../local/imports';
import { OmitNull } from './common.types';
import { IChatResponseMessage } from './chat.types';

export type IUserChange = ITableEvents;
export type IUserChanges = IUserChange[];

export type IInstantChange =
  OmitNull<IChatResponseMessage> &
  Omit<IUserChange, 'message' | 'date'>;
