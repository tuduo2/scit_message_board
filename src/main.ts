import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { Button } from "@nutui/nutui";
import "@nutui/nutui/dist/style.css";
import { InfiniteLoading } from '@nutui/nutui'
const app = createApp(App)

app.use(router)
app.use(Button)
app.use(InfiniteLoading)
app.mount('#app')
