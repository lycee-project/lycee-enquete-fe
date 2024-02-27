<template>
  <div class="qrcode__dialog">
    <div style="text-align: center">
      <QRCodeVue3
        :value="qrCodeUrl"
      ></QRCodeVue3>
    </div>
    <v-container>
      <v-row justify="center">
        <v-btn @click="onClickCopy">クリップボードにURLをコピー</v-btn>
      </v-row>
    </v-container>

    <div class="qd__footer">
      <v-container>
        <v-row>
          <v-spacer></v-spacer>
          <v-btn
            variant="text"
            color="blue"
            @click="onClickClose"
          >
            閉じる
          </v-btn>
        </v-row>
      </v-container>
    </div>

    <!-- スナックバー -->
    <template>
      <v-snackbar v-model="showSnackbar" timeout="1500">
        {{copyText}}
      </v-snackbar>
    </template>
  </div>
</template>

<script>
import QRCodeVue3 from 'qrcode-vue3'

export default {
  name: 'QrcodeDialog',
  components: {
    QRCodeVue3
  },
  props: {
    spaceId: { type: String, required: true }
  },
  data() {
    return {
      showSnackbar: false,
      copyText: null
    }
  },
  computed: {
    qrCodeUrl() {
      const url = new URL(window.location.href)
      return `${url.origin}/?key=${this.spaceId}`
    }
  },
  methods: {
    onClickClose() {
      this.$emit("close")
    },
    onClickCopy() {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(this.qrCodeUrl)
        this.copyText = "コピーしました"
      } else {
        this.copyText = "コピーできませんでした"
      }
      this.showSnackbar = true
    }
  }
}
</script>

<style scoped>
.qrcode__dialog {
  min-width:300px;
}
.qd__footer {
  padding-top: 20px;
}

</style>
