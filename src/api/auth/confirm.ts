import Joi from 'joi';
import { HandlerError, HandlerErrorEnum } from '../../router/errors';
import { THandler } from '../../router/types';

type IConfirmParams = {
  link: string,
  redirect: string,
}

const confirm: THandler<IConfirmParams> = async (context, { link, redirect }) => {
  const result = await execQuery.auth.updateUserLink([link]);
  console.log(result);
  throw new HandlerError(HandlerErrorEnum.E_REDIRECT, { location: redirect });
};
confirm.params = {
  link: Joi.string().required(), //.email(),
  redirect: Joi.string().required(),
};


export = confirm;
