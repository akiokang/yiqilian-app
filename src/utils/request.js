/**
 * 全局网络请求封装
 * 包含：BaseURL处理、请求拦截（Token）、响应拦截（错误处理）
 * 类似 Java 的 RestTemplate 或 HttpClient 封装
 */

// 1. 环境配置（类似 application.yml 中的配置）
const ENV = import.meta.env.MODE; // 'development' 或 'production'
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://your-api-server.com/api';
const TIMEOUT = 10000; // 10秒超时

// 2. 请求队列管理（防止重复请求）
const requestQueue = new Map();

/**
 * 生成请求的唯一 key
 * @param {string} url 
 * @param {string} method 
 * @returns {string}
 */
const generateRequestKey = (url, method) => {
  return `${method}:${url}`;
};

/**
 * 处理后端统一的响应格式
 * 假设后端返回格式：{ code: 0, message: '成功', data: {...} }
 * @param {object} res 
 * @returns {object}
 */
const handleResponse = (res) => {
  const { statusCode, data } = res;

  // HTTP 状态码检查
  if (statusCode < 200 || statusCode >= 300) {
    const errorMessage = data?.message || '网络请求失败';
    throw new Error(`HTTP ${statusCode}: ${errorMessage}`);
  }

  // 业务状态码检查（根据后端约定调整）
  if (data?.code !== 0 && data?.code !== undefined) {
    throw new Error(data?.message || '业务请求失败');
  }

  // 返回业务数据
  return data?.data || data;
};

/**
 * 统一的错误处理
 * @param {Error|object} error 
 * @param {string} url 
 */
const handleError = (error, url) => {
  let errorMessage = '未知错误';
  let errorCode = 'UNKNOWN_ERROR';

  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (error?.errMsg) {
    // uni.request 的 fail 回调
    if (error.errMsg.includes('request:fail timeout')) {
      errorMessage = '请求超时，请检查网络';
      errorCode = 'TIMEOUT_ERROR';
    } else if (error.errMsg.includes('request:fail')) {
      errorMessage = '网络连接失败';
      errorCode = 'NETWORK_ERROR';
    }
  }

  console.error(`[API Error] ${url}:`, errorMessage);

  uni.showToast({
    title: errorMessage,
    icon: 'none',
    duration: 2000
  });

  return { code: errorCode, message: errorMessage };
};

const request = (options) => {
  // 2. 请求拦截：从本地存储获取 JWT Token
  const token = uni.getStorageSync('token');
  const requestKey = generateRequestKey(options.url, options.method || 'GET');

  // 防止重复请求：如果已有相同请求在进行中，直接返回之前的 Promise
  if (requestQueue.has(requestKey)) {
    return requestQueue.get(requestKey);
  }

  const requestPromise = new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...options.header
      },
      timeout: TIMEOUT,
      success: (res) => {
        try {
          const result = handleResponse(res);
          resolve(result);
        } catch (error) {
          handleError(error, options.url);
          reject(error);
        }
      },
      fail: (err) => {
        // 特殊处理 401 错误
        if (err.statusCode === 401) {
          uni.showToast({ title: '登录已过期，请重新登录', icon: 'none' });
          // 清除过期的 token
          uni.removeStorageSync('token');
          uni.removeStorageSync('userInfo');
          // 跳转到登录页
          setTimeout(() => {
            uni.navigateTo({ url: '/pages/login/login' });
          }, 1000);
          reject(new Error('登录过期'));
        } else {
          handleError(err, options.url);
          reject(err);
        }
      }
    });
  }).finally(() => {
    // 请求完成，清除队列记录
    requestQueue.delete(requestKey);
  });

  // 将请求加入队列
  requestQueue.set(requestKey, requestPromise);

  return requestPromise;
};

// 3. 封装常用的快捷方法（类似 RestTemplate 的 postForObject）
export default {
  get: (url, data = {}, header = {}) => request({ url, method: 'GET', data, header }),
  post: (url, data = {}, header = {}) => request({ url, method: 'POST', data, header }),
  put: (url, data = {}, header = {}) => request({ url, method: 'PUT', data, header }),
  delete: (url, data = {}, header = {}) => request({ url, method: 'DELETE', data, header }),
  // 直接获取原始响应（在某些特殊场景下可能需要）
  request
};