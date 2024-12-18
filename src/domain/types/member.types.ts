import * as T from './db.types';

export type IMember = T.ITableNodes & T.ITableMembers;
export type IMemberNode = T.ITableNodes;
export type INodeMember = T.ITableNodes &
  T.ITableMembers &
  T.ITableMembersInvites;

export type IBranchDislikes = Pick<T.ITableNodes, 'node_id'> & {
  dislike_count: number;
};

export type IBranchVotes = Pick<T.ITableNodes, 'node_id'> & {
  vote_count: number;
};

/* net structure */
export type INetMember = T.ITableNodes &
  T.OuterJoin<T.ITableMembers> & {
    invite: boolean;
    dislikes: number;
    votes: number;
  };
