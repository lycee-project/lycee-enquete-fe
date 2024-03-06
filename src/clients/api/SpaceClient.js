import { createApiClient } from '@/clients/api/ApiClient'
import { HEADER_KEY } from '@/constants'

export class SpaceClient {
  endpoint = "/space"
  client
  userId

  constructor (userId) {
    this.client = createApiClient()
    this.userId = userId
  }

  async readAll() {
    return this.client.get(this.endpoint, {}, this.createHeader())
  }

  async readOne(spaceId) {
    return this.client.get(this.endpoint + "/" + spaceId, {}, this.createHeader())
  }

  async create(name, closeDate) {
    return this.client.post(this.endpoint, {
      name: name,
      closeTime: closeDate.getTime()
    },
      this.createHeader()
    )
  }

  async join(spaceId) {
    return this.client.post(this.endpoint + "/join/" + spaceId, {},
      this.createHeader()
      )
  }

  createHeader() {
    const header = {}
    header[HEADER_KEY.USER_ID] = this.userId
    return header
  }

}

