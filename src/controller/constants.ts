import Joi from 'joi';

export const INPUT_MODULES_MAP = {
  setSession: 'set.session.js',
  checkAuthorized: 'checkAuthorized.js',
  getStream: 'get.stream.js',
  validateInput: 'validate.input.js',
  setUserNet: 'set.user.net.js',
};
export type TInputModulesKeys = keyof typeof INPUT_MODULES_MAP;

export const OUTPUT_MODULES_MAP = {
  sendEvents: 'send.events.js',
  validateOutput: 'validate.output.js',
};
export type TOutputModulesKeys = keyof typeof OUTPUT_MODULES_MAP;

export const SERVICES_MAP = {
  mailService: 'mail/mail.js',
  chatService: 'chat/chat.js',
  notificationService: 'notification/notification.js',
};
export type TServicesKeys = keyof typeof SERVICES_MAP;

export const SIMPLE_TYPES = ['boolean', 'string', 'number', 'null'];
export const JOI_NULL = Joi.any().equal(null);
export const EXCLUDE_ROUTES = ['types', 'utils', 'schema'];
