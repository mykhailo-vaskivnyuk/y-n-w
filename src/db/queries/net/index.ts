export const create = `
  INSERT INTO nets (net_level, parent_net_id, first_net_id, node_id)
  VALUES ($1, $2, $3, $4)
  RETURNING *
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
