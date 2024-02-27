<template>

  <v-expansion-panel>
    <!-- ヘッダ -->
    <v-expansion-panel-title disable-icon-rotate>
      <!-- タイトルと期限 -->
      <v-row justify="space-between">
        <v-col class="text-left">{{title}} / {{question.isMultiple ? "複数選択" : "単選択"}} (回答数: {{total}})</v-col>
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
          v-for="(ans, index) in question.answers"
          :key="ans.answerId"
        >
          <v-col class="answer__desc" :style="gauge(ans.answerId, index)">
            {{ans.description + "/" + getCount(ans.answerId)}}
          </v-col>
        </v-row>
      </v-container>

      <!-- 送信ボタン -->
    </v-expansion-panel-text>

  </v-expansion-panel>
</template>

<script>
import { QuestionEntity } from '@/entity/QuestionEntity'

const GAUGE_COLOR = [
  '#ffa0a0',
  '#a3f8e9',
  '#fcaf62',
  '#9dfc9d',
  '#ff9dff'
]

export default {
  name: 'QuestionResultCell',
  props: {
    title: {type: String, required: true },
    question: {
      type: QuestionEntity,
      required: true
    },
    history: {
      type: Object,
      default: () => {}
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
    total() {
      if (!this.history) return 0
      let ttl = 0
      for (let x in this.history) {
        ttl += this.history[x] + 0
      }
      return ttl
    },
  },

  mounted() {
    this.isClosed = this.question.closeTime < this.currentTime
  },

  methods: {
    getCount(answerId) {
      if (!this.history) return 0
      return this.history[answerId] || 0
    },
    gauge (answerId, index) {
      const rate = 100 * this.getCount(answerId) / this.total
      const color = GAUGE_COLOR[index % GAUGE_COLOR.length]

      return {
        background: `linear-gradient(
          90deg,
          ${color} 0%, ${color} calc(${rate}%),
          lightgray calc(${rate}%),lightgray 100%
        )`
      }
    },

    printDeadline(closeTime) {
      if (this.isClosed) {
        return "終了"
      }
      const date = new Date()
      date.setTime(closeTime)
      return "期日：" + (1+date.getMonth()) + "/" + date.getDate() +
        " " + date.getHours() + ":" + date.getMinutes()
    },
  }
}
</script>

<style scoped>
.answer__desc {
  margin: 3px;
}
</style>
