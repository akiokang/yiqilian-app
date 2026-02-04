import http from '@/utils/request'

/**
 * 用户登录接口
 * @param {Object} data - 包含 username 和 password
 */
export const loginApi = (data) => {
  // 对应后端 @PostMapping("/auth/login")
  return http.post('/auth/login', data)
}

/**
 * 获取用户信息
 */
export const getUserInfoApi = () => {
  // 对应后端 @GetMapping("/user/info")
  return http.get('/user/info')
}

/**
 * 退出登录
 */
export const logoutApi = () => {
  return http.post('/auth/logout')
}