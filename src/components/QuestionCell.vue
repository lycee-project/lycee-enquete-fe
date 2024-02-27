<template>
  <v-expansion-panel>
    <!-- ヘッダ -->
    <v-expansion-panel-title disable-icon-rotate>
      <!-- タイトルと期限 -->
      <v-row justify="space-between">
        <v-col class="text-left">{{title}} / {{question.isMultiple ? "複数選択" : "単選択"}}</v-col>
        <v-col class="text-right"
               style="padding-right: 30px"
        >{{ printDeadline(question.closeTime) }}</v-col>
      </v-row>

      <!-- 状態アイコン -->
      <template v-slot:actions>
        <v-icon v-bind="questionIcon">
        </v-icon>
      </template>
    </v-expansion-panel-title>

    <!-- ボディ -->
    <v-expansion-panel-text>
      <v-row>
        <!-- 質問文 -->
        <v-col>
          <div style="white-space: pre-line">
            {{question.content}}
          </div>
        </v-col>
      </v-row>
      <v-container>
        <v-row
          v-for="ans in question.answers"
          :key="ans.answerId"
        >
          <v-checkbox
            v-model="selectedIndexes"
            :label="ans.description"
            :value="ans.answerId"
            :disabled="disableSelect"
            :multiple="question.isMultiple"
            hide-details
          ></v-checkbox>
        </v-row>
      </v-container>

      <!-- 送信ボタン -->
      <v-btn
        class="qc--send_button"
        v-bind="buttonState"
        @click="onSend"
      >{{buttonText}}</v-btn>
    </v-expansion-panel-text>

  </v-expansion-panel>
</template>

<script>
import { QuestionEntity } from '@/entity/QuestionEntity'

export default {
  name: 'QuestionCell',
  emits: [
    "send"
  ],
  props: {
    title: {type: String, required: true },
    question: {
      type: QuestionEntity,
      required: true
    },
    history: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      currentTime: new Date().getTime(),
      isClosed: true,
      selectedIndexes: []
    }
  },
  computed: {
    disableSelect() {
      return this.isClosed || this.history.length > 0
    },
    optionState() {
      return {
        disabled: this.disableSelect
      }
    },
    buttonState() {
      return {
          disabled: this.disableSelect,
          variant: 'outlined',
          color: this.disableSelect ? '' : 'primary'
      }
    },
    buttonText() {
      return this.isClosed ? '終了' :
        (this.history.length > 0 ? '回答済み' : '送信')
    },
    questionIcon() {
      if (this.isClosed) {
        // 期限切れ
        return {
          color: "red",
          icon: "mdi-check-bold"
        }

      } else if (this.history.length > 0) {
        // 期限内回答済み
        return {
          color: "light-blue darken-3",
          icon: "mdi-checkbox-marked-circle-outline"
        }

      } else {
        // 期限内未回答
        return {
          color: "green",
          icon: "mdi-clock-time-three-outline"
        }
      }
    },
  },
  mounted() {
    this.isClosed = this.question.closeTime < this.currentTime

    if (this.history) {
      if (this.question.isMultiple) {
        this.selectedIndexes = this.history
      } else {
        this.selectedIndexes = this.history[0]
      }
    }
  },
  methods: {
    printDeadline(closeTime) {
      if (this.isClosed) {
        return "終了"
      }
      const date = new Date()
      date.setTime(closeTime)
      return "期日：" + (1+date.getMonth()) + "/" + date.getDate() +
        " " + date.getHours() + ":" + date.getMinutes()
    },
    onSend() {
      let answers
      if (this.selectedIndexes.isArray) {
        answers = this.selectedIndexes
      } else {
        answers = [this.selectedIndexes]
      }
      this.$emit("send", {
        questionId: this.question.id,
        answers: answers
      })
    }
  }
}
</script>

<style scoped>
.answer-area {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
}
.qc--send_button {
  width: 200px;
  position: absolute;
  bottom: 10px;
  right: 10px;
}
</style>
