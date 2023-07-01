import { THandler } from '../../router/types';
import {
  IUserResponse, IUserUpdateParams,
} from '../../client/common/server/types/types';
import {
  UserResponseSchema, UserUpdateParamsSchema,
} from '../schema/account.schema';

export const read: THandler<never, IUserResponse> = async ({ session }) => {
  const user_id = session.read('user_id');
  const user_status = session.read('user_status')!;
  if (!user_id) return null;
  const [user] = await execQuery.user.get([user_id]);
  return { ...user!, user_status };
};
read.responseSchema = UserResponseSchema;
read.allowedForUser = 'NOT_LOGGEDIN';

export const update: THandler<IUserUpdateParams, IUserResponse> =
  async ({ session }, data) => {
    const user_id = session.read('user_id')!;
    const user_status = session.read('user_status')!;
    let [user] = await execQuery.user.get([user_id]);
    const newUserData = [
      data.name || null,
      data.mobile || null,
      data.password ?
        await cryptoService.createHash(data.password) :
        user!.password,
    ] as const;
    [user] = await execQuery.user.update([user_id, ...newUserData]);
    return { ...user!, user_status };
  };
update.paramsSchema = UserUpdateParamsSchema;
update.responseSchema = UserResponseSchema;
