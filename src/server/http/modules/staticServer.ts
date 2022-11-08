import { createStaticServer } from '../static';
import { THttpModule } from '../types';
import { IInputConnectionConfig } from '../../types';

const getifApi = (api: string) => (url = '') => {
  const regExp = new RegExp(`^/${api}(/.*)?$`);
  return regExp.test(url);
};

export const staticServer: THttpModule = (
  config: IInputConnectionConfig['http'],
) => {
  const { public: publicPath, api } = config.paths;
  const ifApi = getifApi(api);
  const httpStaticServer = createStaticServer(publicPath);
  return async function staticServer(
    req, res, { ...options }, context,
  ) {
    if (ifApi(req.url)) return options;
    await httpStaticServer(req, res, context);
    return null;
  };
};
