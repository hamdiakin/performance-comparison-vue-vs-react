import './assets/tailwind.css'
import Vue, { createApp } from '@vue/compat'
import BootstrapVue from 'bootstrap-vue'
import App from './App.vue'
import router from './router'

//for bootstrap
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
const app = createApp(App)

app.use(router)
app.mount('#app')
