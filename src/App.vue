<template>
  <v-app>
    <router-view></router-view>

    <template v-for="(dialog, index) in dialogStack" :key="dialog.title">
      <lycee-modal-dialog
        :show="dialog.show"
        :title="dialog.title"
        :persistent="dialog.persistent"
        :full-screen="dialog.fullScreen"
        :icon-use="dialog.iconUse"
        @close="closeDialog(index, $event)"
      >
        <template #default="{ onClose, onUpdateIcon }">
          <component
            :is="dialog.dialog"
            v-bind="dialog.props"
            @close="onClose"
            @update-icon="onUpdateIcon"
          ></component>
        </template>
      </lycee-modal-dialog>
    </template>
  </v-app>
</template>

<script>

import TestView from '@/components/sample/TestView'
import LyceeModalDialog from '@/components/common/dialog/LyceeModalDialog'
import SpaceList from '@/components/SpaceList'
import { markRaw } from 'vue'

export default {
  name: 'App',
  components: { SpaceList, LyceeModalDialog, TestView },
  data() {
    return {
      dialogStack: [],
    }
  },
  methods: {
    showDialog(comp) {
      if (window.activeElement) {
        window.activeElement.blur()
      }
      return new Promise(resolve => {
        comp.show = true
        comp.onClose = resolve
        comp.dialog = markRaw(comp.dialog)
        this.dialogStack.push(comp)
      })
    },

    closeDialog(index, event) {
      const [deleted] = this.dialogStack.splice(index, 1)
      if (deleted.onClose) {
        deleted.onClose(event)
      }
    }
  },
  provide() {
    return {
      showDialog: this.showDialog
    }
  }

}
</script>
