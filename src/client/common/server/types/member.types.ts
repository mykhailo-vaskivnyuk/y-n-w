import {
  ITableUsers, ITableMembersInvites, OuterJoin,
  ITableMembersToMembers, ITableMembers, ITableNodes,
} from '../../../local/imports';

export type IMemberInviteParams = {
  node_id: number;
  member_node_id: number;
  member_name: string;
};

export type IMemberConfirmParams = Omit<IMemberInviteParams, 'member_name'>;

export type IMemberResponse =
  Pick<ITableNodes, 'node_id' | 'count_of_members'> &
  OuterJoin<Pick<ITableUsers, 'user_id' | 'name'>> &
  OuterJoin<Pick<ITableMembers, 'confirmed'>> &
  OuterJoin<Pick<ITableMembersInvites, 'token' | 'member_name'>> &
  OuterJoin<
    Omit<ITableMembersToMembers, 'parent_node_id' | 'user_id' | 'member_id'>
  > &
  { vote_count: number };
