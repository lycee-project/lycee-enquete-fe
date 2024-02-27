<template>
  <v-dialog
    :model-value="show"
    :full-screen="fullScreen"
    :persistent="persistent"
    width="unset"
    @click:outside="onClickOutside"
  >
    <div class="lmd__content">
      <!-- ヘッダー -->
      <header v-if="title" class="lmd__content-title">
        <v-container v-if="iconUse">
          <v-row>
            {{title}}
            <v-spacer></v-spacer>
            <v-icon v-bind="icon"></v-icon>
          </v-row>
        </v-container>
        <v-container v-else>
          {{title}}
        </v-container>
      </header>

      <!-- ボディ -->
      <main>
        <slot
          v-bind:onClose="close"
          v-bind:onUpdateIcon="onUpdateIcon"
        ></slot>
      </main>
    </div>
  </v-dialog>
</template>

<script>
export default {
  name: 'LyceeModalDialog',
  emits: [
    "close", "update:show"
  ],
  props: {
    show: { type: Boolean, required: true },
    fullScreen: { type: Boolean, default: false },
    persistent: { type: Boolean, default: false },
    title: { type: String, default: ""},
    iconUse: { type: Boolean, default: false }
  },
  data() {
    return {
      iconData: {
        color: "gray",
        icon: "mdi-exclamation-thick"
      }
    }
  },
  mounted () {
  },
  computed: {
    icon() {
      return this.iconData
    }
  },
  methods: {
    close(result) {
      if(this.show) {
        this.$emit("update:show", false)
      }
      this.$emit("close", result)
    },
    onClickOutside() {
      if (this.persistent) return
      this.close()
    },
    onUpdateIcon(value) {
      this.iconData = {
        color: value.color,
        icon: value.icon
      }
    }
  },

}
</script>

<style scoped>
.lmd__content {
  background-color: white;
  padding: 10px;
  border-radius: 5px;
  min-width: 200px;
  min-height: 150px;
}

.lmd__content-title {
  font-size: 1.3rem;
  padding: 10px;
}

</style>
