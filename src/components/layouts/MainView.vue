<template>
  <v-main>
    <!-- ヘッダー -->
    <v-app-bar
      elevation="4"
      color="blue lighten-3"
    >
      <v-app-bar-title>
        簡単アンケート
      </v-app-bar-title>
    </v-app-bar>

    <!-- コンテンツ -->
    <router-view></router-view>

  </v-main>
</template>

<script>

export default {
  name: 'MainView',
  data() {
    return {
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
