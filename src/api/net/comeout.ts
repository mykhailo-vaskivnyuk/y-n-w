import Joi from 'joi';
import { THandler } from '../../router/types';

const comeout: THandler<never, boolean> =
  async ({ session }) => {
    session.delete('net_id');
    session.delete('node_id');
    session.write('user_status', 'LOGGEDIN');
    return true;
  };
comeout.responseSchema = Joi.boolean();
comeout.allowedForUser = 'NOT_LOGGEDIN';

export = comeout;
