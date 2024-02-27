import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import MultiDialogView from '@/components/sample/MultiDialogView'
import router from '@/plugins/router'

loadFonts()

const test = false
const target = test ? MultiDialogView : App

createApp(target)
  .use(vuetify)
  .use(router)
  .mount('#app')
