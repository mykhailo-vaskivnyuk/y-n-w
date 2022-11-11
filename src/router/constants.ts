export const INPUT_MODULES = {
  getStream: 'get.stream.js',
  validate: 'validate.js',
  setSession: 'set.session.js',
};
export type TInputModulesKeys = keyof typeof INPUT_MODULES;

export const OUTPUT_MODULES = {
  validateResponse: 'validate.response.js',
};
export type TOutputModulesKeys = keyof typeof OUTPUT_MODULES;

export const SERVICES = {
  mailService: 'send.mail.js',
};
export type TServicesKeys = keyof typeof SERVICES;

export const SIMPLE_TYPES = ['boolean', 'string', 'number'];
