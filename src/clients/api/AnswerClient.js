import { createApiClient } from '@/clients/api/ApiClient'
import { HEADER_KEY } from '@/constants'

export class AnswerClient {
  base_endpoint = "/answer"
  client
  userId
  spaceId

  constructor (userId, spaceId) {
    this.client = createApiClient()
    this.userId = userId
    this.spaceId = spaceId
  }

  async readAllInSpace() {
    return this.client.get(this.base_endpoint +"/all", {}, this.createHeader())
  }

  async readAll(questionId) {
    return this.client.get(this.createEndpoint(questionId), {}, this.createHeader())
  }

  async summaryInSpace(spaceId) {
    return this.client.get(this.base_endpoint + `/summary/${spaceId}`, {}, this.createHeader())
  }

  async answer({questionId, answers}) {
    return this.client.post(this.createEndpoint(questionId), answers,
      this.createHeader()
    )
  }

  createEndpoint(questionId) {
    return `${this.base_endpoint}/${questionId}`
  }

  createHeader() {
    const header = {}
    header[HEADER_KEY.USER_ID] = this.userId
    header[HEADER_KEY.SPACE_ID] = this.spaceId
    return header
  }

}

