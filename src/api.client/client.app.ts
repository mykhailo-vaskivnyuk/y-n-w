import { api } from './api';
import { connection } from './connection';

// const baseUrl = 'https://merega.herokuapp.com/api';

class ClientApp {
  private clientApi;
  
  constructor(baseUrl: string) {
    this.clientApi = api(baseUrl, connection);
  }

  async testRequest() {
    const users = await this.clientApi.users.read({});
    console.log(users);
  }
}
