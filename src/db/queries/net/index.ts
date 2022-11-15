export const create = `
  INSERT INTO nets (net_level, parent_net_id, first_net_id, count_of_nets)
  VALUES($1, $2, $3, $4)
  RETURNING *
`;
