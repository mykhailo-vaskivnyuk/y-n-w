const getNets = `
  SELECT * FROM nets_users_data
  LEFT JOIN nets ON nets_users_data.net_id = nets.net_id
  RIGHT JOIN nets_data ON nets.net_id = nets_data.net_id
  WHERE nets_users_data.user_id = $1 AND nets.parent_net_id ISNULL
`;

export = getNets;
