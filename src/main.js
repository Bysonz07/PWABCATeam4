import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import {registerSW} from 'virtual:pwa-register'
import router from './router'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

const intervalMs = 10000
const updateSW = registerSW({
    onRegistered(r) {
        r && setInterval(() => {
            r.update()
        }, intervalMs)
    }
})

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi',
      },
  })

registerSW({immediate : true})
const app = createApp(App)
app.use(vuetify)
app.use(router).mount('#app')
