import { api } from './client.api';
import { connection } from './client.fetch';

// const baseUrl = 'https://merega.herokuapp.com/api';

export class ClientApp {
  private clientApi;
  
  constructor(baseUrl: string) {
    this.clientApi = api(baseUrl, connection);
  }

  async testRequest() {
    const users = await this.clientApi.users.read({});
    console.log(users);
  }
}
