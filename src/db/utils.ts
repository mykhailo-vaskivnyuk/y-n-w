export const userNetAndItsSubnets = (netIndex = 1, userIndex = 2) => `
  nets_users_data.user_id = $${userIndex} AND
  (
    (
      ($1 + 1) NOTNULL AND
      nets.first_net_id = $${netIndex} AND
      nets.net_level >= (
        SELECT net_level FROM nets WHERE net_node_id = $${netIndex}
      )
    ) OR
    ($1 + 1) ISNULL
  )
`;
