"use strict";
const usersRead = async (context) => {
    const { session } = context;
    // const options = {
    //   from: 'm.vaskivnyuk@gmail.com',
    //   to: 'm.vaskivnyuk@gmail.com',
    //   subject: 'Test email',
    //   text: 'Hello, Mykhailo!',
    // };
    // await sendMail(options);
    session.write('userId', 1000);
    return execQuery.user.getUsers([]);
};
module.exports = usersRead;
//# sourceMappingURL=read.js.map