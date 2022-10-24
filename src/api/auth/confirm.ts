import Joi from 'joi';
import { HandlerError, HandlerErrorEnum } from '../../router/errors';
import { THandler } from '../../router/types';

type IConfirmParams = {
  link?: string,
  restore?: string,
  redirect: string,
}

const confirm: THandler<IConfirmParams> = async (context, { link, restore, redirect }) => {
  if (!link && !restore) throw new HandlerError(HandlerErrorEnum.E_REDIRECT, { error: 'bad link' });
  const [linkExists] = link
    ? await execQuery.auth.getUserByLink([link])
    : await execQuery.auth.getUserByRestoreLink([restore!])
  if (!linkExists) throw new HandlerError(HandlerErrorEnum.E_REDIRECT, { error: 'bad link' });
  const result = link 
    ? await execQuery.auth.unsetUserLink([link])
    : await execQuery.auth.unsetUserRestoreLink([restore!]);
  console.log(result);
  throw new HandlerError(HandlerErrorEnum.E_REDIRECT, { location: redirect });
};
confirm.params = {
  link: Joi.string(), //.email(),
  restore: Joi.string(), //.email(),
  redirect: Joi.string().required(),
};

export = confirm;
