<template>
  <v-main>
    <!-- ヘッダー -->
    <v-app-bar
      elevation="4"
      color="blue lighten-3"
    >
      <v-app-bar-title @click="onClickDevTool">
        簡単アンケート
      </v-app-bar-title>
    </v-app-bar>

    <!-- コンテンツ -->
    <router-view></router-view>

  </v-main>
</template>

<script>
import { BackdoorClient } from '@/clients/api/BackdoorClient'
import { getUserId } from '@/utils'

export default {
  name: 'MainView',
  data() {
    return {
      backdoorClient: null
    }
  },
  mounted () {
    getUserId()
    .then(userId => {
      this.backdoorClient = new BackdoorClient(userId)
    })
  },
  methods: {
    onClickDevTool() {
      this.backdoorClient.joinAllSpace()
    },
  }
}
</script>

<style scoped>

</style>
