import Joi from 'joi';
import { THandler } from '../../router/types';

const comeout: THandler<any, boolean> =
  async (context) => {
    const { session } = context;
    session.delete('net_id');
    session.write('user_state', 'LOGGEDIN');
    return true;
  };
comeout.responseSchema = Joi.boolean();
comeout.allowedForUser = 'NOT_LOGGEDIN';

export = comeout;
