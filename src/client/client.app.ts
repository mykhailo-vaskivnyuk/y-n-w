import { api } from './client.api';
import { getConnection } from './client.fetch';

export class ClientApp {
  private clientApi;
  
  constructor(baseUrl: string) {
    const connection = getConnection(baseUrl);
    this.clientApi = api(connection);
  }

  async testRequest() {
    const users = await this.clientApi.users.read({});
    console.log(users);
  }
}
