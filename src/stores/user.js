import { defineStore } from 'pinia'
import { ref } from 'vue'

// 这就是你的全局用户状态单例 (User Service)
export const useUserStore = defineStore('user', () => {
  // 1. 定义属性 (State)
  const token = ref(uni.getStorageSync('token') || '')
  const phone = ref(uni.getStorageSync('phone') || '')

  // 2. 定义操作方法 (Actions)
  const setInfo = (userToken, userPhone) => {
    token.value = userToken
    phone.value = userPhone
    
    // 持久化到磁盘
    uni.setStorageSync('token', userToken)
    uni.setStorageSync('phone', userPhone)
  }

  const clearInfo = () => {
    token.value = ''
    phone.value = ''
    uni.removeStorageSync('token')
    uni.removeStorageSync('phone')
  }

  return {
    token,
    phone,
    setInfo,
    clearInfo
  }
})