import Joi from 'joi';
import { THandler } from '../../../router/types';

const comeout: THandler<never, boolean> =
  async ({ session }) => {
    session.delete('net_id');
    session.delete('node_id');
    session.write('user_state', 'LOGGEDIN');
    return true;
  };
comeout.responseSchema = Joi.boolean();

export = comeout;
