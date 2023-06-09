import { TQuery } from '../../types/types';

export interface IQueriesUserMessenger {
  connect: TQuery<[
    ['user_id', number],
    ['chatId', string],
  ]>;
}

export const connect = `
  UPDATE users
  SET chatId = $2
  WHERE user_id = $1
`;
