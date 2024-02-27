import { createApiClient } from '@/clients/api/ApiClient'

export class EchoClient {
  client
  endpoint = "/echo"

  constructor () {
    this.client = createApiClient()
  }

  get(id) {
    return this.client.get(this.endpoint + "/" + id)
  }

  post() {
    return this.client.post(this.endpoint)
  }

  put() {
    return this.client.put(this.endpoint)
  }

  delete() {
    return this.client.delete(this.endpoint)
  }
}
