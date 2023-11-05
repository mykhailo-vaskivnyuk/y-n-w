import { DomainError } from '../errors';
import { IMember } from '../types/member.types';

export class Member {
  private member!: IMember;

  async init(user_id: number, node_id: number) {
    const [member] = await execQuery
      .user.netData.findByNode([user_id, node_id]);
    if (!member) throw new DomainError('NOT_FOUND');
    this.member = member;
    return this;
  }

  status() {
    const { confirmed } = this.member;
    return confirmed ? 'INSIDE_NET' : 'INVITING';
  }

  get() {
    return this.member;
  }

  async getNet() {
    const { net_id } = this.member;
    const [net] = await execQuery.net.getData([net_id]);
    return net!;
  }
}
