import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router/index.ts'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)

app.use(router)
// 可引入动态引入减小打包体积
app.use(ElementPlus)
app.mount('#app')
