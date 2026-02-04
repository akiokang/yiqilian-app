import { useUserStore } from '@/stores/user'

// 白名单：不需要登录就能访问的页面
const whiteList = [
  '/pages/login/login'
]

export function setupPermission() {
  // 定义需要拦截的方法列表
  const list = ['navigateTo', 'redirectTo', 'reLaunch', 'switchTab']
  
  list.forEach(item => {
    uni.addInterceptor(item, {
      // 拦截前触发（类似 preHandle）
      invoke(e) {
        // 1. 获取目标页面路径
        const url = e.url.split('?')[0]
        
        // 2. 检查是否在白名单中
        if (whiteList.includes(url)) {
          return e
        }
        
        // 3. 校验登录状态（从 Pinia 中读取 Token）
        const userStore = useUserStore()
        const token = userStore.token || uni.getStorageSync('token')
        
        if (token) {
          return e
        } else {
          // 4. 未登录且不在白名单，强制重定向到登录页
          uni.showToast({
            title: '请先登录',
            icon: 'none'
          })
          uni.navigateTo({
            url: '/pages/login/login'
          })
          return false // 终止本次跳转
        }
      },
      fail(err) {
        console.log('拦截器报错：', err)
      }
    })
  })
}