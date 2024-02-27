<template>
  <!--  :show="show"
    title="スペースの新規作成"
    ok="新規作成"
    :onClick="onClick"
   -->
  <div class="osd__content">
    <v-file-input
      ref="fileInput"
      style="display: none"
      v-model="selectedFile"
      @click="(e) => e.target.value=''"
    ></v-file-input>
    <!--    <v-img
      width="200"
      height="200"
      class="bg-grey-lighten-1"
      :src="imagePath"
      @click="onClickSelectImage"
      v-if="useImage"
    >
      <template v-slot:placeholder>
        <v-row
          class="fill-height"
          align="center"
          justify="center"
        >
          <v-icon
            large
            color="grey"
            class="align-center"
          >
            mdi-camera
          </v-icon>
        </v-row>
      </template>
    </v-img>
    -->
    <v-text-field
      style="padding-top: 10px"
      label="スペース名"
      variant="outlined"
      v-model="spaceName"
    >
    </v-text-field>

    <div>スペースの有効期限は3日間です</div>

    <div class="osd__actions">
      <v-container>
        <v-row>
          <v-spacer></v-spacer>
          <v-btn
            style="margin-right: 10px;"
            variant="outlined"
            color="red"
            @click="onClickClose"
          >閉じる</v-btn>
          <v-btn
            color="blue"
            @click="onClick"
          >新規登録</v-btn>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>

import * as util from '@/utils'
import { SpaceClient } from '@/clients/api/SpaceClient'

export default {
  name: 'OpenSpaceDialog',
  emits: [
    "close"
  ],
  data() {
    return {
      useImage: false,
      selectedFile: [],
      spaceName: null,
      endTime: null,

      // クライアント
      spaceClient: null
    }
  },
  computed: {
    imagePath() {
      return this.selectedFile[0] ? URL.createObjectURL(this.selectedFile[0]) : null
    }
  },
  watch: {
    show(newValue, oldValue) {
      if (newValue && !oldValue) {
        this.selectedFile = []
        this.spaceName = null
      }
    }
  },
  mounted () {
    const startDate = new Date()
    this.endTime = new Date(new Date().setDate(startDate.getDate() + 3))

    util.getUserId()
      .then(userId => {
        this.spaceClient = new SpaceClient(userId)
      })
  },
  methods: {
    onClickSelectImage() {
      this.$refs.fileInput.click()
    },
    onClickClose() {
      this.$emit("close", false)
    },
    onClick() {
      const closeDate = util.getCurrentDate()
      closeDate.setDate(closeDate.getDate() + 3)

      this.spaceClient.create(this.spaceName, closeDate, this.selectedFile)
        .then(result => {
          if (result.status === 201) {
            this.$emit("close", true)
          } else {
            // error
          }

        })
    }
  }
}
</script>

<style scoped>
.osd__content {
  width: 300px;
}
.osd__actions {
  border-top: lightgray solid thin;
  margin-top: 5px;
  padding-top: 5px;
}
</style>
