import Joi from 'joi';
import { THandler } from '../controller/types';
import { IEchoData } from '../client/common/server/types/types';
import { EchoDataSchema } from './schema/schema';

export const health: THandler<never, string> = async () => 'API IS READY';
health.responseSchema = Joi.string();
health.allowedForUser = 'NOT_LOGGEDIN';

export const echo: THandler<IEchoData, IEchoData> =
  async (_, data) => {
    logger.debug('', data);
    return data;
  };
echo.paramsSchema = EchoDataSchema;
echo.responseSchema = EchoDataSchema;
echo.allowedForUser = 'NOT_LOGGEDIN';
