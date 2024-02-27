const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,

  /* 開発用設定値 */
  devServer: {
    port: 8888,
    proxy: {
      /* API プロキシー */
      "^/api/": {
        target: "http://localhost:8080"
      },
    }
  },

  pluginOptions: {
    vuetify: {},
    moment: {
      locales: [
        ''
      ]
    }
  }
})
