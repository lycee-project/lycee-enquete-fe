<template>
  <teleport to="#modalDialogs">
    <v-dialog
      :model-value="show"
      width="unset"
      :full-screen="fullScreen"
      :persistent="persistent"
    >
      <slot></slot>
    </v-dialog>
  </teleport>
</template>

<script>
export default {
  name: 'LyceeModal',
  emits: [
    "click:outside"
  ],
  props: {
    show: { type: Boolean, required: true },
    fullScreen: { type: Boolean, default: false },
    persistent: { type: Boolean, default: false },
    scrollable: { type: Boolean, default: false },
  },
  data() {
    return {
    }
  },
  methods: {
    onClickOutside(e) {
      if (!this.persistent) {
        this.$emit("click:outside", e)
      }
    }
  }
}
</script>
<style scoped>
</style>
