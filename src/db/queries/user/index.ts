export const getById = `
  SELECT * FROM users
  WHERE user_id=$1
`;

export const findByEmail = `
  SELECT users.*, users_tokens.comfirm_token FROM users
  LEFT JOIN users_tokens ON users.user_id = users_tokens.user_id
  WHERE email=$1
`;

export const findByToken = `
  SELECT * FROM users
  WHERE confirm_token=$1 OR restore_token=$1
`;

export const create = `
  INSERT INTO users (email, password)
  VALUES($1, $2)
  RETURNING *
`;

export const createTokens = `
  INSERT INTO users_tokens (user_id, confirm_token)
  VALUES($1, $2)
`;

export const setToken = `
  UPDATE users SET confirm_token=$2, restore_token=$3
  WHERE user_id=$1
`;

export const unsetToken = `
  UPDATE users SET confirm_token=NULL, restore_token=NULL
  WHERE user_id=$1
`;
