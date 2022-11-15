export const getById = `
  SELECT * FROM users
  WHERE user_id=$1
`;

export const findByEmail = `
  SELECT * FROM users
  WHERE email=$1
`;

export const findByToken = `
  SELECT * FROM users
  WHERE confirm_token=$1 OR restore_token=$1
`;

export const create = `
  INSERT INTO users (email, password, confirm_token)
  VALUES($1, $2, $3)
  RETURNING *
`;

export const setToken = `
  UPDATE users SET confirm_token=$2, restore_token=$3
  WHERE user_id=$1
`;

export const unsetToken = `
  UPDATE users SET confirm_token=NULL, restore_token=NULL
  WHERE user_id=$1
`;
