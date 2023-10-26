import { TOutputModule } from '../types';

const sendEvents: TOutputModule = () => async (response) => {
  notificationService.sendEvents().catch((e) => logger.warn(e));
  notificationService.sendNotifs().catch((e) => logger.warn(e));
  return response;
};

export default sendEvents;
