import Stomp from 'stomp-websocket'
import { HEADER_KEY } from '@/constants'

// 質問追加通知
const endpointNoticeQuestion = "/notice/question/"
// スペース更新通知
const endpointNoticeInfo = "/notice/info/"
// 回答送信
const endpointSendAnswer = "/send/answer/"

class LiveClient {
  // WebSocketのエンドポイント
  webSocketEndpoint = null

  // ユーザID
  userId = null
  // 接続先のスペースID
  spaceId = null

  // STOMPクライアント
  stompClient = null

  // webSocket通信時のヘッダ情報
  webSocketHeader = null

  // 接続状況
  connected = false

  // 質問追加通知：受信時の処理
  question = () => {}

  // スペース更新通知：受信時の処理
  info = () => {}

  constructor (spaceId, userId) {
    this.spaceId = spaceId
    this.userId = userId
    this.webSocketHeader = {}
    this.webSocketHeader[HEADER_KEY.USER_ID] = this.userId
    this.webSocketHeader[HEADER_KEY.SPACE_ID] = this.spaceId

    const endpoint = process.env.VUE_APP_WEBSOCKET_ENDPOINT
    if (endpoint.startsWith("ws://") || endpoint.startsWith("wss://")) {
      // プロトコルから指定されているときはそのまま使う
      this.webSocketEndpoint = endpoint
    } else {
      // プロトコル指定ではないとき，現在のホストを使ってエンドポイントを生成する
      const url = new URL(window.location.href)
      if (url.protocol === "http") {
        this.webSocketEndpoint = `ws://${url.host}` + endpoint
      } else {
        this.webSocketEndpoint = `wss://${url.host}` + endpoint
      }
    }
  }

  /**
   * 接続状態の取得
   * @returns {boolean}
   */
  get isConnected() {
    return this.connected
  }

  /**
   * STOMP over WebSocketの接続
   * @param connected 接続後のコールバック
   */
  connect(connected = () => {}) {
    if (this.stompClient) {
      // 接続済みの場合，何もしない
      return
    }
    // クライアント作成
    const socket = new WebSocket(this.webSocketEndpoint + this.spaceId)
    this.stompClient = Stomp.over(socket)

    if (!("VUE_APP_WEBSOCKET_DEBUG" in process.env)) {
      // WebSocketの通信ログの抑止
      this.stompClient.debug = null
    }

    this.stompClient.connect(
      this.webSocketHeader,
      (frame) => {
        if (frame.command !== "CONNECTED") {
          return
        }

        this.stompClient.subscribe(
          endpointNoticeQuestion + this.spaceId,
          this._callbackSubscribe(this.question))

        this.stompClient.subscribe(
          endpointNoticeInfo + this.spaceId,
          this._callbackSubscribe(this.info))

        this.connected = true
        connected(frame.body.type, frame.body.contents)
      },
      (error) => {
        console.debug("websocket is disconnected, because try reconnecting...", "error:", error)
        this.stompClient = null
        this.connect(connected)
      })
  }

  /**
   * 遮断処理
   * @param disconnected 遮断後のコールバック処理
   */
  disconnect(disconnected = () => {}) {
    if (this.stompClient == null) {
      // 遮断済みの場合は何もしない
      return
    }
    this.stompClient.disconnect(() => {
        this.connected = false
        disconnected()
      },
      this.webSocketHeader
    )
    this.stompClient = null
  }

  sendAnswer(answerId) {
    this.stompClient.send(
      endpointSendAnswer + this.spaceId,
      this.webSocketHeader,
      JSON.stringify({
        answerId: answerId
      })
    )
  }


  _callbackSubscribe(callback) {
    return (frame) => {
      callback(frame.body.type, frame.body.contents)
    }
  }

}



export {
  LiveClient
}
