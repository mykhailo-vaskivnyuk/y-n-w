import path from 'path';
import { getEnumFromMap } from '../utils/utils';

const basePathModules = 'js/router/modules';
const basePathResponseModules = 'js/router/modules.response';

export const MODULES = {
  getStream: path.resolve(basePathModules, 'get.stream'),
  validate: path.resolve(basePathModules, 'validate'),
  setSession: path.resolve(basePathModules, 'set.session'),
  setMailService: path.resolve(basePathModules, 'send.mail'),
};

export const MODULES_ENUM = getEnumFromMap(MODULES);

export const MODULES_RESPONSE = {
  validateResponse: path.resolve(basePathResponseModules, 'validate.response'),
};

export const MODULES_RESPONSE_ENUM = getEnumFromMap(MODULES_RESPONSE);
