export const create = `
  INSERT INTO nets (node_id)
  VALUES ($1)
  RETURNING *
`;

export const remove = `
  DELETE FROM nets WHERE node_id = $1
`;

export const createData = `
  INSERT INTO nets_data (net_id, name)
  VALUES ($1, $2)
  RETURNING *
`;

export const createUserData = `
  INSERT INTO nets_users_data (net_id, user_id)
  VALUES ($1, $2)
  RETURNING *
`;

export const readUserData = `
  SELECT * FROM nets_users_data
  LEFT JOIN nets ON nets_users_data.net_id = nets.net_id
  JOIN nets_data ON nets.net_id = nets_data.net_id
  WHERE nets_users_data.user_id = $1 AND nets.net_id = $2
`;
