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

export const remove = `
  DELETE FROM nodes WHERE node_id = $1
`;

export const updateCountOfMembers = `
  UPDATE nodes
  SET count_of_members = count_of_members + $2
  WHERE node_id = $1
  RETURNING *
`;

export const removeUserFromAll = `
  UPDATE nodes
  SET user_id = NULL, count_of_members = count_of_members - 1
  WHERE user_id = $1
  RETURNING *
`;

export const removeUserFromOne = `
  UPDATE nodes
  SET user_id = NULL, count_of_members = count_of_members - 1
  WHERE node_id = $1
  RETURNING *
`;

export const removeTree = `
    DELETE FROM nodes
    WHERE parent_node_id = $1
`;

export const findByUserNet = `
    SELECT nodes.* FROM nodes
    INNER JOIN nets ON
      nodes.node_id = nets.node_id OR
      nodes.node_id = nodes.first_node_id
    WHERE user_id = $1 AND net_id = $2
`;
