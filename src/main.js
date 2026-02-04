import { createSSRApp } from 'vue'
import * as Pinia from 'pinia'
import App from './App.vue'
import { setupPermission } from './permission' // 1. 引入拦截器

export function createApp() {
  const app = createSSRApp(App)
  const pinia = Pinia.createPinia()
  app.use(pinia)

  // 2. 启动路由守卫逻辑（注意：要在 app 挂载前后调用均可，通常在初始化阶段）
  setupPermission()

  return {
    app,
    pinia
  }
}