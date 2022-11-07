import { createStaticServer } from '../static';
import { IInputConnectionConfig, THttpModule } from '../../types';

const getfsApi = (api: string) => (url = '') => {
  const regExp = new RegExp(`^/${api}(/.*)?$`);
  return regExp.test(url);
};

export const staticServer: THttpModule = (
  config: IInputConnectionConfig['http'],
) => {
  const { public: publicPath, api } = config.paths;
  const ifApi = getfsApi(api);
  const httpStaticServer = createStaticServer(publicPath);
  return async (req, res, context) => {
    if (ifApi(req.url)) return true;
    await httpStaticServer(req, res, context);
    return false;
  };
};
