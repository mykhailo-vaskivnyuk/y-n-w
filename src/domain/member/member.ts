import { DomainError } from '../errors';
import { IMemberNet } from '../types/member.types';

export class Member {
  private memberNet!: IMemberNet;

  async init(user_id: number, node_id: number) {
    const [memberNet] = await execQuery
      .user.netData.findByNode([user_id, node_id]);
    if (!memberNet) throw new DomainError('NOT_FOUND');
    return this;
  }

  getStatus() {
    const { confirmed } = this.memberNet;
    return confirmed ? 'INSIDE_NET' : 'INVITING';
  }

  get() {
    return this.memberNet;
  }
}
