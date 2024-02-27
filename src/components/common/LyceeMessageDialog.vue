<template>
  <div class="dialog__content">
    <!-- メッセージ領域 -->
    <div class="dialog__message">
      {{message}}
    </div>
    <!-- アクション領域 -->
    <div class="dialog__actions">
      <v-container>
        <v-row>
          <v-spacer></v-spacer>
          <v-btn
            v-for="(button, index) in buttons"
            :key="index"
            @click="onButtonClick(button)"
            class="dialog__button"
            :variant="button.variant"
            :color="button.color"
          >
            {{button.text}}
          </v-btn>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>

export default {
  name: 'LyceeMessageDialog',
  props: {
    message: {
      type: String,
      required: true
    },
    buttons: {
      type: Array,
      default: () => [{
        text: 'OK',
        color: 'blue',
        variant: "outlined",
        click: () => true
      }]
    }
  },
  methods: {
    onButtonClick(target, e) {
      const callback = target.click || function () {return true}

      const message = target.id || target.text
      const isCanceled = !callback(message)

      if (isCanceled) {
        e.preventDefault()
      } else {
        this.$emit('close', message)
      }
    }
  }
}
</script>

<style scoped>
.dialog__content {
  padding: 15px;
}
.dialog__message {
  margin-top: 15px;
  margin-bottom: 15px;
}
.dialog__actions {
  border-top: lightgray solid thin;
  margin-top: 5px;
  padding-top: 15px;
}
.dialog__button {
  margin-left: 10px;
}

</style>
