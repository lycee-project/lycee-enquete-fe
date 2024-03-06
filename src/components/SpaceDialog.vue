<template>
  <div class="sd__main">
    <div class="sd__container">
      <div class="sd__body">
        <v-container v-if="questions.length === 0">
          <v-card title="まだ質問がありません">
          </v-card>
        </v-container>

        <v-expansion-panels>
          <template v-if="isOwner">
            <question-result-cell
              v-for="(question, index) in questions"
              :key="question.id"
              :title="(index+1) +'つ目の質問'"
              :question="question"
              :history="history[question.id] || {}"
            ></question-result-cell>
            <question-register-cell
              v-model="registerExpanded"
              ref="registerCell"
              @register="onRegister"
            ></question-register-cell>
          </template>
          <template v-else>
            <question-cell
              v-for="(question, index) in questions"
              :key="question.id"
              :title="(index+1) +'つ目の質問'"
              :question="question"
              :history="history[question.id]"
              @send="onSubmit"
            ></question-cell>
          </template>
        </v-expansion-panels>
      </div>
      <div class="sd__footer">
        <v-container>
          <v-row>
            <v-btn
              variant="text"
              color="red"
              prepend-icon="mdi-qrcode"
              @click="onClickQr"
              v-if="isOwner"
            >
             QRコード
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              variant="text"
              color="green"
              prepend-icon="mdi-reload"
              @click="onClickReload"
              style="margin-right: 20px"
            >
              再読み込み
            </v-btn>
            <v-btn
              variant="text"
              color="blue"
              prepend-icon="mdi-door"
              @click="onLeaveSpace"
            >
              退室
            </v-btn>
          </v-row>
        </v-container>
      </div>
    </div>
  </div>
</template>

<script>
import LyceeMessageDialog from '@/components/common/LyceeMessageDialog'
import QuestionCell from '@/components/QuestionCell'
import { LiveClient } from '@/clients/websocket/LiveClient'
import { getUserId } from '@/utils'
import { SpaceClient } from '@/clients/api/SpaceClient'
import QuestionRegisterCell from '@/components/QuestionRegisterCell'
import { QuestionClient } from '@/clients/api/QuestionClient'
import { QuestionEntity } from '@/entity/QuestionEntity'
import { QUESTION_TYPE } from '@/constants'
import { AnswerClient } from '@/clients/api/AnswerClient'
import QuestionResultCell from '@/components/QuestionResultCell'
import QrcodeDialog from '@/components/QrcodeDialog'


export default {
  name: 'SpaceDialog',
  components: { QuestionResultCell, QuestionRegisterCell, QuestionCell },
  emits: [
    "close", "update-icon"
  ],
  inject: [
    "showDialog"
  ],
  props: {
    spaceId: { type: String, required: true }
  },
  data() {
    return {
      /* ユーザ情報 */
      userId: null,

      /* スペース情報 */
      space: null,

      /* 質問 */
      questions: [],
      history: {},

      /* 登録パネル */
      isOwner: false,
      registerExpanded: false,

      /* クライアント */
      spaceClient: null,
      questionClient: null,
      answerClient: null,

      /* websocket */
      liveClient: null,
      errorCount: 0,
    }
  },
  computed: {
    currentTime() {
      return new Date().getTime()
    }
  },
  mounted() {
    this.updateConnectionIcon(false)

    getUserId()
    .then(userId => {
      this.userId = userId
      this.spaceClient = new SpaceClient(userId)
      this.questionClient = new QuestionClient(userId, this.spaceId)
      this.answerClient = new AnswerClient(userId, this.spaceId)

      // スペース情報の取得
      this.reloadSpaceInfo()

      // クローズ時のイベント登録（ブラウザごと終了された時，WebSocketを切断させるため）
      window.addEventListener("beforeunload", this.leaveSpace)

      // WebSocketの接続
      this.joinSpace()
    })
  },
  unmounted() {
    window.removeEventListener("beforeunload", this.leaveSpace)
    this.leaveSpace()
  },
  methods: {

    /**
     * 再読み込み処理
     */
    reloadSpaceInfo() {
      this.spaceClient.readOne(this.spaceId)
        .then(result => {
          if(result.status !== 200) {
            return
          }
          this.space = result.data
          this.isOwner = (this.userId === this.space.ownerId)
          this.reloadQuestions()
        })
    },

    /**
     * 退出処理
     */
    onLeave() {
      this.leaveSpace()
      this.$emit("close")
    },

    /*
     * 送信ボタン ----------------------------------------
     */
    onSubmit(data) {
      this.answerClient.answer({
        questionId: data.questionId,
        answers: data.answers
      }).then(() => {
        this.reloadQuestions()
      })
    },

    /*
     * 新規追加ボタン ----------------------------------------
     */
    onRegister(data) {
      const endDate = new Date()

      // TODO: 回答期限の設定を追加する
      endDate.setHours(endDate.getHours() + 6)

      this.questionClient.create({
        type: QUESTION_TYPE.SINGLE,
        endDate: endDate,
        ...data}
      ).then(result => {
        if (result.status !== 201) {
          return
        }
        // fixme: 自動で閉じない...
        this.registerExpanded = false

        this.reloadQuestions()
        this.$refs.registerCell.reset()
      })
    },

    /*
     * 読み込みボタン ----------------------------------------
     */
    onClickReload() {
      this.reloadQuestions()
    },

    /*
     * 退室ボタン ----------------------------------------
     */
    onLeaveSpace() {
      this.showDialog({
          dialog: LyceeMessageDialog,
          title: "確認",
          persistent: true,
          props: {
            message:`スペース「${this.space.name}」から退出しますか？`,
            buttons: [
              { text: "Cancel", color: "red", variant: "text" },
              { text: "OK", color: "blue", variant: "text" },
            ]
          }
        })
      .then(result => {
        if (result === "OK") {
          this.onLeave()
        }
      })
    },

    reloadQuestions() {

      const answerPromise = this.isOwner ?
        this.answerClient.summaryInSpace(this.spaceId) : this.answerClient.readAllInSpace()

      Promise.all([
        this.questionClient.readAll(),
        answerPromise,
      ])
      .then(resultAll => {
        const [ questions, answers ] = resultAll

        this.questions = questions.data.questions.map(it => {
          return new QuestionEntity(
            it.questionId,
            it.type,
            it.description,
            it.answers,
            /* isMultiple(仮置き) */it.type === QUESTION_TYPE.MULTIPLE,
            it.endTime
          )
        })

        const history = {}
        for (let answer of answers.data.history) {
          history[answer.questionId] = answer.answers
        }
        this.history = history
      })
    },

    /**
     * QRボタン選択
     */
    onClickQr() {
      this.showDialog({
        dialog: QrcodeDialog,
        title: "スペースのQRコード",
        props: {
          spaceId: this.spaceId
        }
      })
    },

    /*
     * WebSocket ----------------------------------------
     */

    /**
     * スペース参加
     */
    joinSpace() {
      // クライアント作成 + WebSocket接続
      this.liveClient = new LiveClient(this.spaceId, this.userId)
      this.liveClient.question = (/*type, contents*/) => {
        this.reloadQuestions()
      }
      this.liveClient.info = (/*type, contents*/) => {
        this.reloadQuestions()
      }

      this.liveClient.connect((/*type, contents*/) => {
        this.updateConnectionIcon(true)
      })
    },

    /**
     * スペース退出
     */
    leaveSpace() {
      if (this.liveClient) {
        this.liveClient.disconnect(() => {})
      }
      this.liveClient = null
    },

    /**
     * ダイアログのアイコン更新
     * @param enable 接続状態
     */
    updateConnectionIcon(enable) {
      const icon = (enable) ? {
        color: "blue",
        icon: "mdi-link-variant"
      } : {
        color: "red",
        icon: "mdi-link-variant-off"
      }
      this.$emit("update-icon", icon)
    }
  }
}
</script>

<style scoped>
.sd__main {
  min-width: 600px;
  height: 450px;
}
.sd__container {
  display: flex;
  flex-direction: column;
  height: 100%;
  border-top: lightgray solid thin;
  margin-top: 5px;
  padding-top: 15px;
}
.sd__body {
  flex: 1;
  overflow-y: auto;
}
.sd__footer {
  height: 50px;
  background-color: lightcyan;
}
</style>
