const remove = `
  DELETE FROM users WHERE user_id=$1
`;

export default remove;
