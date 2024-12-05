import { DomainError } from '../errors';
import { IMember } from '../types/member.types';

export class Member {
  private member!: IMember;

  async init(user_id: number, node_id: number) {
    const [member] = await execQuery.user.netData.findByNode([
      user_id,
      node_id,
    ]);
    if (!member) throw new DomainError('NOT_FOUND');
    this.member = member;
    return this;
  }

  async reinit() {
    const { user_id, node_id } = this.get();
    return this.init(user_id, node_id);
  }

  get() {
    if (this.member) return this.member;
    throw new DomainError('NOT_FOUND');
  }

  status() {
    const { confirmed } = this.get();
    return confirmed ? 'INSIDE_NET' : 'INVITING';
  }

  async getNet() {
    const { net_id } = this.get();
    const [net] = await execQuery.net.getData([net_id]);
    return net!;
  }
}
