export const createInitial = `
  INSERT INTO nodes (count_of_members, node_date, user_id)
  VALUES (1, $1, $2)
  RETURNING *
`;

export const create = `
  INSERT INTO nodes (
    node_level,
    node_position,
    parent_node_id,
    first_node_id,
    node_date,
    user_id
  )
  VALUES ($1, $2, $3, $4, $5, NULL)
`;
