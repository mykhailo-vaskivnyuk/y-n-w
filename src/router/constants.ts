import { resolve } from 'path';

const basePathModules = 'js/router/modules';
const basePathResponseModules = 'js/router/modules.response';
const basePathServices = 'js/router/services';

export const MODULES = {
  getStream: resolve(basePathModules, 'get.stream.js'),
  validate: resolve(basePathModules, 'validate.js'),
  setSession: resolve(basePathModules, 'set.session.js'),
};
export type TModulesKeys = keyof typeof MODULES;

export const MODULES_RESPONSE = {
  validateResponse: resolve(basePathResponseModules, 'validate.response.js'),
};
export type TModulesResponseKeys = keyof typeof MODULES_RESPONSE;

export const SERVICES = {
  mailService: resolve(basePathServices, 'send.mail.js'),
};
export type TServicesKeys = keyof typeof SERVICES;

export const SIMPLE_TYPES = ['boolean', 'string', 'number'];
