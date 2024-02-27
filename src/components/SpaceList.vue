<template>
  <div class="text-center">
    <v-list>
      <v-list-item
        v-for="s in spaceList" :key="s.id"
      >
        <space-card
          :entity="s"
          @click.stop="showSpaceDialog(s)"
        ></space-card>
      </v-list-item>

      <v-list-item>
        <v-container>
          <v-card @click="showOpenSpaceDialog"
            title="スペースの新規追加">
          </v-card>
        </v-container>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import SpaceCard from '@/components/SpaceCard'
import {SpaceEntity} from '@/entity/SpaceEntity'
import OpenSpaceDialog from '@/components/OpenSpaceDialog'
import SpaceDialog from '@/components/SpaceDialog'
import { SpaceClient } from '@/clients/api/SpaceClient'
import * as util from '@/utils'
import { BackdoorClient } from '@/clients/api/BackdoorClient'
import LyceeMessageDialog from '@/components/common/LyceeMessageDialog'

export default {
  name: 'SpaceList',
  components: {
    SpaceCard
  },
  inject: [
    "showDialog"
  ],
  data() {
    return {
      spaceList: [],

      // クライアント
      spaceClient: null,
      backdoorClient: null
    }
  },

  mounted () {
    util.getUserId()
    .then(userId => {
      this.initialize(userId)
    })
  },

  methods: {
    async initialize(userId) {
      this.spaceClient = new SpaceClient(userId)
      this.backdoorClient = new BackdoorClient(userId)
      await this.reloadSpaceList()
      await this.joinSpace()
    },

    async reloadSpaceList() {
      const result = await this.spaceClient.readAll()

      if (result.status !== 200) {
        return
      }
      const list = []
      for (let s of result.data.spaces) {
        list.push(SpaceEntity.from({
          ...s
        }))
      }
      this.spaceList = list
    },

    /**
     * スペース新規作成ダイアログ
     */
    showOpenSpaceDialog() {
      this.showDialog({
        dialog: OpenSpaceDialog,
        title: "スペースの新規作成",
      }).then(() => {
        this.reloadSpaceList()
      })
    },

    /**
     * スペースの表示
     * @param space
     */
    showSpaceDialog(space) {
      this.showDialog({
        dialog: SpaceDialog,
        persistent: true,
        title: space.name,
        iconUse: true,
        props: {
          spaceId: space.id
        }
      })
    },

    async joinSpace() {
      const spaceId = this.$route.query.key
      if (!spaceId) {
        return
      }

      if (this.spaceList.some(s => s.spaceId === spaceId)) {
        // リストにあるスペースIDの時参加済みのため処理不要
        return
      }

      // スペースの参加
      const result = await this.spaceClient.join(spaceId)
      let message
      if (result.status === 204) {
        // 登録済みの時
        return
      } else if (result.status === 200) {
        message = "スペースに参加できるようになりました"
      } else {
        message = "エラーが発生しました"
      }

      // メッセージダイアログの表示
      const selected = await this.showDialog({
        dialog: LyceeMessageDialog,
        props: {
          message
        }
      })

      if (result.status === 200 && selected === "OK") {
        // スペース参加できてOKボタン押下時のみリロードが必要
        await this.reloadSpaceList()
      }
    }
  }
}
</script>

<style scoped>

</style>
