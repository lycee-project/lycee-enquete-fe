<template>
  <div style="text-align: center; margin-top:50px">
    <div>
      参加手続き中......
    </div>
    <div v-if="isError">
      手続きに失敗しました...
      再度やり直してください
    </div>
    <div v-if="isComplete">
      スペースに参加できるようになりました<br>
      <a href="/">ホーム画面</a>からスペースを選択してください<br>

    </div>
  </div>
</template>

<script>
import { getUserId } from '@/utils'
import { SpaceClient } from '@/clients/api/SpaceClient'

export default {
  name: 'QrCodeJoinView',
  data() {
    return {
      spaceId: null,
      userId: null,

      isError: false,
      isComplete: false,

      /**/
      spaceClient: null
    }
  },
  computed: {

  },
  mounted () {
    getUserId().then(userId => {
      this.userId = userId
      this.spaceClient = new SpaceClient(userId)
      if (this.$route.query.key) {
        this.spaceClient.join(this.$route.query.key).then(result => {
          if(result.status !== 200) {
            this.isError = true
          } else {
            this.isComplete = true
          }
        })
      } else {
        this.isError = true
      }
    })

  }

}
</script>

<style scoped>

</style>
