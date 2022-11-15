export type TNetCreate = {
  net_level: number;
  parent_net_id: number | null;
  first_net_id: number | null;
  count_of_nets: number;
};
export type TNetCreateResponse = {
  net_id: number;
  net_level: number;
  parent_net_id: number | null;
  first_net_id: number | null;
  count_of_nets: number;
};
export type TScriptsScriptjsResponse = Record<string, any>;
export type TUserCreate = {
  name: string;
  field: number;
};
export type TUserCreateResponse = {
  name: string;
};
