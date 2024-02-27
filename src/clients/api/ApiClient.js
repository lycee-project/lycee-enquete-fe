
import { createApiClient as jsonLoad_createApiClient} from '@/clients/api/base/json_load_client'
import { createApiClient as apiCall_createApiClient} from '@/clients/api/base/api_call_client'

// APIモードのリスト
const envClientList = {
  local: jsonLoad_createApiClient,
  api: apiCall_createApiClient
}

const _createApiClient = envClientList[process.env.VUE_APP_API_MODE]

export {
  _createApiClient as createApiClient
}
