import { createApiClient } from '@/clients/api/ApiClient'

export class UserClient {
  client
  endpoint = "/user"

  constructor () {
    this.client = createApiClient()
  }

  async publishId() {
    return this.client.post(this.endpoint)
  }

}

