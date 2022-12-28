export const findUserNet = async (
  user_id: number, net_id?: number | null,
) => {
  if (!net_id) return;
  const [net] = await execQuery.user.net.find([user_id, net_id]);
  return net;
};
