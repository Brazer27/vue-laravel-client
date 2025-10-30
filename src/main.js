import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import axios from 'axios'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

axios.defaults.withCredentials = false
axios.defaults.baseURL = API_URL

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.mount('#app')