import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import axios from 'axios'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './style.css'

axios.defaults.withCredentials = true
axios.defaults.baseURL = 'http://localhost:8000'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.mount('#app')