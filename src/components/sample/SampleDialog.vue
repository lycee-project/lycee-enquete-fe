<template>
  <v-dialog
    v-model="showDialog"
    @click:outside="onClickOutside"
  >
    <v-card>
      <v-card-title>ダイアログ</v-card-title>
      <v-card-text>
        <slot></slot>
      </v-card-text>
      <v-card-actions>
        <v-btn
          @click.stop="onClick"
        >OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'SampleDialog',
  props: {
    show: {type: Boolean, default: false}
  },
  computed: {
    showDialog: {
      set(value) {
        this.$emit("update:show", value)
      },
      get() {
        return this.show
      }
    }
  },
  methods: {
    onClick() {
      this.$emit("ok-button")
    },
    onClickOutside() {
      this.$emit("close")
    }
  }
}
</script>

<style scoped>

</style>
