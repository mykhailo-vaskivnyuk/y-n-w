import { resolve } from 'path';

const basePathModules = 'js/router/modules';
const basePathResponseModules = 'js/router/modules.response';

export const MODULES = {
  getStream: resolve(basePathModules, 'get.stream'),
  validate: resolve(basePathModules, 'validate'),
  setSession: resolve(basePathModules, 'set.session'),
  setMailService: resolve(basePathModules, 'send.mail'),
};

export const MODULES_RESPONSE = {
  validateResponse: resolve(basePathResponseModules, 'validate.response'),
};
