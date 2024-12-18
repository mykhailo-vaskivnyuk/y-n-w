import {
  ITableUsers,
  ITableMembersInvites,
  OuterJoin,
  ITableMembersToMembers,
  ITableMembers,
  ITableNodes,
} from '../../../local/imports';

export type IMemberInviteParams = {
  node_id: number;
  member_node_id: number;
  member_name: string;
};

export type IMemberConfirmParams = Omit<IMemberInviteParams, 'member_name'>;

export type IMemberResponse = Pick<
  ITableNodes,
  'node_id' | 'count_of_members'
> &
  OuterJoin<Pick<ITableMembers, 'user_id' | 'confirmed'>> &
  OuterJoin<Pick<ITableUsers, 'name'>> &
  OuterJoin<Pick<ITableMembersInvites, 'token' | 'member_name'>> &
  OuterJoin<Pick<ITableMembersToMembers, 'dislike' | 'vote'>> & {
    vote_count: number;
  };
