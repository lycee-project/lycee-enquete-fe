<template>
  <v-expansion-panel :model-value="modelValue">
    <!-- ヘッダ -->
    <v-expansion-panel-title disable-icon-rotate>
      <!-- タイトルと期限 -->
      <v-row style="display:flex">
        <v-col>新規登録</v-col>
      </v-row>

      <!-- 状態アイコン -->
      <template v-slot:actions>
        <v-icon icon="mdi-text-box-edit-outline">
        </v-icon>
      </template>
    </v-expansion-panel-title>

    <!-- ボディ -->
    <v-expansion-panel-text>
      <v-row>
        <!-- 質問文 -->
        <v-col>
          <div>
            <v-textarea
              v-model="description"
              label="Description"
              density="compact"
            ></v-textarea>
          </div>
        </v-col>
      </v-row>
      <!-- 回答 -->
      <v-container>
        <v-row v-for="(_, index) in answers" :key="index">
          <v-text-field
            v-model="answers[index]"
            variant="outlined"
            density="compact"
            :label="(index+1)+ 'つ目の選択肢'"
          ></v-text-field>
        </v-row>
      </v-container>

      <!-- アクションエリア -->
      <v-container>
        <v-row>
          <v-text-field
            variant="outlined"
            density="compact"
            label="回答期限"
            style="width: 50px;"
            v-if="0"
          ></v-text-field>
          <div class="text-grey">回答期限は登録から6時間です</div>
          <v-spacer></v-spacer>
          <v-btn
            v-bind="submitProperties"
            @click="onRegister"
          >登録</v-btn>
        </v-row>
      </v-container>
    </v-expansion-panel-text>

  </v-expansion-panel>
</template>

<script>

const ANSWER_SIZE = 5

export default {
  name: 'QuestionRegisterCell',
  emits: [
    "register"
  ],
  props: {
    modelValue: { type: Boolean, default: false}
  },
  data() {
    return {
      description: null,
      answers: null
    }
  },
  computed: {
    submitProperties() {
      const canSubmit = !!this.description &&
        this.answers.filter(a => a!== "").length >= 2

      return {
        flat: true,
        disabled: !canSubmit,
        color: canSubmit ? "primary" : "gray"
      }
    },
  },
  mounted () {
    this.reset()
  },
  methods: {
    reset() {
      this.description = ""
      this.answers = []
      for (let i = 0; i < ANSWER_SIZE; i++) {
        this.answers.push("")
      }
    },
    onRegister() {
      this.$emit("register", {
        description: this.description,
        answers: this.answers.filter(a => a !== "")
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
.qrc__title {
  width: 100px;
  font-size: 0.5rem;
}
</style>
