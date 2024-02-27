import { createApiClient } from '@/clients/api/ApiClient'
import { HEADER_KEY } from '@/constants'

export class BackdoorClient {
  base_endpoint = "/backdoor"
  client
  userId

  constructor (userId) {
    this.client = createApiClient()
    this.userId = userId
  }

  async joinAllSpace() {
    return this.client.post(this.base_endpoint +"/space", {}, this.createHeader())
  }

  createEndpoint(questionId) {
    return `${this.base_endpoint}/${questionId}`
  }

  createHeader() {
    const header = {}
    header[HEADER_KEY.USER_ID] = this.userId
    return header
  }

}

