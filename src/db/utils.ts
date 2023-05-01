export const userInNetAndItsSubnets = (userIndex = 1, netIndex = 2) => `
  members.user_id = $${userIndex} AND
  (
    $${netIndex}::int ISNULL OR
    (
      nets.net_id = $${netIndex} AND
      nets.net_level >=
      (
        SELECT net_level FROM nets WHERE net_id = $${netIndex}
      )
    )
  )
`;
