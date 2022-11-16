export const create = `
  INSERT INTO nodes (parent_node_id, first_node_id, node_date, user_id)
  VALUES ($1, $2, $3, $4)
  RETURNING *
`;
