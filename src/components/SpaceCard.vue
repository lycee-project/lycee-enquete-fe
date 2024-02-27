<template>
  <v-container>
    <v-card
      class="room-card"
      :img="entity.roomImg"
      :title="entity.name"
      :subtitle="subtitle"
      :text="entity.desc"
    >
    </v-card>
  </v-container>
</template>

<script>
import moment from 'moment'
import { SpaceEntity } from '@/entity/SpaceEntity'

export default {
  name: 'SpaceCard',
  props: {
    entity: {
      type: SpaceEntity,
      required: true
    },
    size: {
      type: Number,
      default: 150
    }
  },
  computed: {
    subtitle () {
      const open = moment(this.entity.openedDate).format("MM/DD hh:mm")
      const close = moment(this.entity.closeDate).format("MM/DD hh:mm")
      return `開設日時：${open} / 終了日時：${close}`
    }
  }
}
</script>

<style scoped lang="scss">
.room-card {
  cursor: default;
  -webkit-user-select:none;

  &:hover {
    background-color: lightcyan;
  }

}
</style>
