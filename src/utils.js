
import {
  LOCAL_STORAGE_KEY
} from '@/constants'

import { UserClient } from '@/clients/api/UserClient'

// showDialog(xxxDialog, {
//   title: "",
// })
// .then(result => {
//   ....
// })
// みたいなダイアログをメソッド形式で実装したい
//
// Vue2でのサンプル
// https://zenn.dev/tshuto/articles/bd236f2f49b0d1
//
// Vue3ではVue.extendがないから少し手を加える必要がある
// https://v3.ja.vuejs.org/guide/migration/global-api.html#vue-extend-%E3%81%AE%E5%89%8A%E9%99%A4
//
function hasAvailableValue(obj, key) {
  return key in obj && obj[key] !== null && obj[key] !== ""
}

function getRealDate() {
  return new Date()
}

function getFixedDate(fixedDate) {
  return () => Date.parse(fixedDate)
}

const _getCurrentDate = (hasAvailableValue(process.env, "VUE_APP_FIXED_DATE"))
  ? getFixedDate(process.env.VUE_APP_FIXED_DATE) : getRealDate

export function getCurrentDate() {
  return _getCurrentDate()
}

export async function getUserId() {

  const userId = localStorage.getItem(LOCAL_STORAGE_KEY.USER_ID)
  if (userId) {
    return userId
  }

  const client = new UserClient()
  const response = await client.publishId().then(result => {
    return result.data
  })

  localStorage.setItem(LOCAL_STORAGE_KEY.USER_ID, response.userId)
  return response.userId
}
