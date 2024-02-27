import { createApiClient } from '@/clients/api/ApiClient'
import { HEADER_KEY } from '@/constants'

export class QuestionClient {
  base_endpoint = "/question"
  endpoint
  client
  userId


  constructor (userId, spaceId) {
    this.client = createApiClient()
    this.userId = userId
    this.endpoint = `${this.base_endpoint}/${spaceId}`
  }

  async readAll() {
    return this.client.get(this.endpoint, {}, this.createHeader())
  }

  async create({type, description, answers, endDate}) {
    return this.client.post(this.endpoint, {
        type: type,
        description: description,
        answers: answers,
        endTime: endDate.getTime()
      },
      this.createHeader()
    )
  }

  createHeader() {
    const header = {}
    header[HEADER_KEY.USER_ID] = this.userId
    return header
  }

}

