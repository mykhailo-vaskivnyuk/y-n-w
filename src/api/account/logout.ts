import Joi from 'joi';
import { THandler } from '../../controller/types';

const logout: THandler<never, boolean> = async ({ session, connectionId }) => {
  await session.clear();
  chatService.removeConnection(connectionId);
  return true;
};
logout.responseSchema = Joi.boolean();
logout.allowedForUser = 'NOT_LOGGEDIN';

export = logout;
