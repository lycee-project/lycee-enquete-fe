import axios from 'axios'
import ApiClient from '@/clients/api/base/api_client'

class JsonLoadClient extends ApiClient {
  client
  hook

  userId

  constructor (client, hook, userId) {
    super()
    this.client = client
    this.hook = hook
    this.userId = userId
  }

  // eslint-disable-next-line no-unused-vars
  #request(method, endpoint, params) {
    const path = this.createJsonPath(endpoint, method +  ".json")
    return this.client.get("/" + path)
  }

  get(endpoint, params) {
    return this.#request("get", endpoint, params)
  }

  post(endpoint, params) {
    return this.#request("post", endpoint, params)
  }

  put(endpoint, params) {
    return this.#request("put", endpoint, params)
  }

  delete(endpoint, params) {
    return this.#request("delete", endpoint, params)
  }

  createJsonPath(...args) {
    return args
      .map(str => (str.charAt(0) === '/') ? str.substr(1) : str)
      .map(str => (str.charAt(str.length - 1) === '/') ? str.substr(1) : str)
      .reduce((url, str) => {
        return url + "/" + str
      })
  }
}


// ローカル開発モードでのaxios設定
const axiosClient = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
})

function createApiClient(hook) {
  return new JsonLoadClient(axiosClient, hook, process.env.VUE_APP_DUMMY_USER_ID)
}

export {
  createApiClient
}
