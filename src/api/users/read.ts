import { THandler } from '../../router/types';

const usersRead: THandler = async (context) => {
  const { session, sendMail } = context;
  const options = {
    from: 'm.vaskivnyuk@gmail.com',
    to: 'm.vaskivnyuk@gmail.com',
    subject: 'Test email',
    text: 'Hello, Mykhailo!',
  };
  await sendMail(options);
  session.write('userId', 1000);
  return execQuery.user.getUsers([]);
};

export = usersRead;
