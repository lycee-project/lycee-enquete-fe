<template>
  <v-container>
    <v-btn
      @click.stop="onClickFirstDialog"
    >Show First Dialog</v-btn>

    <sample-dialog
      :show="isShowFirstDialog"
      @ok-button="onCloseFirstDialog"
    >
      <div>
        First Dialog<br>
        <v-btn
          @click.stop="onClickSecondDialog"
        >Show Second Dialog</v-btn>
      </div>
    </sample-dialog>

    <sample-dialog
      :show="isShowSecondDialog"
      @ok-button="onCloseSecondDialog"
    >
      <div>
        Second Dialog<br>
        <v-btn
          @click.stop="onClickThirdDialog"
        >Show Third Dialog</v-btn>
      </div>
    </sample-dialog>

    <sample-dialog
      :show="isShowThirdDialog"
      @ok-button="onCloseThirdDialog"
    >
      <div>
        Third Dialog<br>
      </div>
    </sample-dialog>
  </v-container>
</template>

<script>

import SampleDialog from '@/components/sample/SampleDialog'
export default {
  name: 'MultiDialogView',
  components: { SampleDialog },
  data() {
    return {
      isShowFirstDialog: false,
      isShowSecondDialog: false,
      isShowThirdDialog: false,
    }
  },
  methods: {
    onClickFirstDialog() {
      this.isShowFirstDialog = true
    },
    onCloseFirstDialog() {
      this.isShowFirstDialog = false
    },
    onClickSecondDialog() {
      this.isShowSecondDialog = true
    },
    onCloseSecondDialog() {
      this.isShowSecondDialog = false
    },
    onClickThirdDialog() {
      this.isShowThirdDialog = true
    },
    onCloseThirdDialog() {
      this.isShowThirdDialog = false
    },
  }
}
</script>
<style lang="scss">
</style>
