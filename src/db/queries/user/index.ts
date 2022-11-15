export const getById = `
  SELECT * FROM users
  WHERE user_id=$1
`;

export const findByEmail = `
  SELECT * FROM users
  WHERE email=$1
`;

export const findByLink = `
  SELECT * FROM users
  WHERE link=$1 OR restore=$1
`;

export const create = `
  INSERT INTO users (email, password, link)
  VALUES($1, $2, $3)
  RETURNING *
`;

export const setLink = `
  UPDATE users SET link=$2, restore=$3
  WHERE user_id=$1
`;

export const unsetLink = `
  UPDATE users SET link=NULL, restore=NULL
  WHERE user_id=$1
`;
