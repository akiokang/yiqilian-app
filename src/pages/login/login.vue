<template>
  <view class="login-container">
    <view class="login-card">
      <view class="logo-section">
        <view class="logo">💪</view>
        <text class="title">欢迎回来</text>
        <text class="subtitle">请输入您的手机号和密码</text>
      </view>
      
      <!-- 登录方式切换 -->
      <view class="login-method-toggle">
        <button 
          type="button" 
          :class="['toggle-btn', { active: loginMethod === 'password' }]"
          @click="switchLoginMethod('password')"
        >
          密码登录
        </button>
        <button 
          type="button" 
          :class="['toggle-btn', { active: loginMethod === 'code' }]"
          @click="switchLoginMethod('code')"
        >
          验证码登录
        </button>
      </view>
      
      <view class="input-group">
        <text class="input-label">手机号</text>
        <input 
          type="tel" 
          v-model="formData.phone"
          :class="{ 'input-error': errorFields.includes('phone') }"
          @focus="removeError('phone')"
          placeholder="请输入您的手机号" 
        />
        <text v-if="errorFields.includes('phone')" class="error-message">
          {{ errorMessages.phone }}
        </text>
      </view>
      
      <view v-if="loginMethod === 'password'" class="input-group">
        <text class="input-label">密码</text>
        <input 
          type="password" 
          v-model="formData.password"
          :class="{ 'input-error': errorFields.includes('password') }"
          @focus="removeError('password')"
          placeholder="请输入您的密码" 
        />
        <text v-if="errorFields.includes('password')" class="error-message">
          {{ errorMessages.password }}
        </text>
      </view>
      
      <!-- 验证码输入区域 -->
      <view v-if="loginMethod === 'code'" class="input-group">
        <text class="input-label">验证码</text>
        <view class="code-input-container">
          <input 
            type="text" 
            v-model="formData.verificationCode"
            :class="{ 'input-error': errorFields.includes('verificationCode') }"
            @focus="removeError('verificationCode')"
            placeholder="请输入验证码" 
            maxlength="6"
          />
          <button 
            type="button" 
            @click="getVerificationCode"
            :disabled="isCounting"
            class="get-code-btn"
          >
            {{ isCounting ? `${countdown}秒后重试` : '获取验证码' }}
          </button>
        </view>
        <text v-if="errorFields.includes('verificationCode')" class="error-message">
          {{ errorMessages.verificationCode }}
        </text>
      </view>
      
      <button class="login-btn" @click="handleLogin" :disabled="isLoading">
        {{ isLoading ? '登录中...' : '登录' }}
      </button>
      
      <view class="forgot-password-container">
        <text class="forgot-password" @click="handleForgotPassword">忘记密码?</text>
      </view>
      
      <view class="new-user-hint">
        新用户？直接登录即可
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, onBeforeUnmount } from 'vue';
import { useUserStore } from '@/stores/user';

// 状态定义
const loginMethod = ref('password'); // 'password' 或 'code'
const formData = reactive({
  phone: '',
  password: '',
  verificationCode: ''
});
const isLoading = ref(false);
const isCounting = ref(false);
const countdown = ref(60);
let countdownInterval = null;
const errorFields = ref([]);
const errorMessages = reactive({});

// Store
const userStore = useUserStore();

// 切换登录方式
const switchLoginMethod = (method) => {
  loginMethod.value = method;
};

// 获取验证码
const getVerificationCode = async () => {
  // 验证手机号
  if (!formData.phone) {
    uni.showToast({ title: '请先输入手机号', icon: 'none' });
    highlightField('phone');
    return;
  }
  
  const phoneRegex = /^1[3-9]\d{9}$/;
  if (!phoneRegex.test(formData.phone)) {
    uni.showToast({ title: '请输入正确的手机号格式', icon: 'none' });
    highlightField('phone');
    return;
  }
  
  if (isCounting.value) return;
  
  // 模拟发送验证码
  console.log(`验证码已发送至: ${formData.phone}`);
  uni.showToast({ title: '验证码已发送，请注意查收', icon: 'success' });
  
  isCounting.value = true;
  countdown.value = 60;
  
  countdownInterval = setInterval(() => {
    countdown.value--;
    
    if (countdown.value <= 0) {
      clearInterval(countdownInterval);
      countdownInterval = null;
      isCounting.value = false;
      countdown.value = 60;
    }
  }, 1000);
};

// 登录处理
const handleLogin = async () => {
  // 清空之前的错误
  errorFields.value = [];
  Object.keys(errorMessages).forEach(key => delete errorMessages[key]);
  
  // 验证手机号
  if (!formData.phone) {
    uni.showToast({ title: '请输入手机号', icon: 'none' });
    highlightField('phone');
    return;
  }
  
  const phoneRegex = /^1[3-9]\d{9}$/;
  if (!phoneRegex.test(formData.phone)) {
    uni.showToast({ title: '请输入正确的手机号格式', icon: 'none' });
    highlightField('phone');
    return;
  }
  
  // 根据登录方式进行验证
  if (loginMethod.value === 'password') {
    // 密码登录验证
    if (!formData.password) {
      uni.showToast({ title: '请输入密码', icon: 'none' });
      highlightField('password');
      return;
    }
    
    if (formData.password.length < 6) {
      uni.showToast({ title: '密码长度至少为6位', icon: 'none' });
      highlightField('password');
      return;
    }
  } else {
    // 验证码登录验证
    if (!formData.verificationCode) {
      uni.showToast({ title: '请输入验证码', icon: 'none' });
      highlightField('verificationCode');
      return;
    }
    
    if (formData.verificationCode.length !== 6) {
      uni.showToast({ title: '请输入6位验证码', icon: 'none' });
      highlightField('verificationCode');
      return;
    }
  }
  
  // 显示加载状态
  isLoading.value = true;
  
  try {
    // 模拟API请求
    await simulateLogin();
    
    // 登录成功，保存用户信息到store
    userStore.setInfo('mock-token', formData.phone);
    
    uni.showToast({
      title: '登录成功！',
      icon: 'success',
      duration: 1500,
      success: () => {
        // 跳转到首页
        uni.reLaunch({
          url: '/pages/index/index'
        });
      }
    });
  } catch (error) {
    uni.showToast({ 
      title: error.message || '登录失败，请重试', 
      icon: 'none' 
    });
  } finally {
    isLoading.value = false;
  }
};

// 模拟登录API
const simulateLogin = async () => {
  // 模拟网络延迟
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 模拟偶尔的错误情况
      if (Math.random() < 0.1) {
        reject(new Error('用户名或密码错误，请重试'));
      } else {
        resolve();
      }
    }, 2000);
  });
};

// 忘记密码处理
const handleForgotPassword = () => {
  uni.showToast({ title: '忘记密码功能正在开发中...', icon: 'none' });
};

// 高亮错误字段
const highlightField = (field) => {
  if (!errorFields.value.includes(field)) {
    errorFields.value.push(field);
  }
  
  // 设置错误消息
  const messages = {
    phone: '请输入手机号',
    password: '请输入密码',
    verificationCode: '请输入验证码'
  };
  errorMessages[field] = messages[field] || '输入有误';
  
  // 2秒后移除错误高亮
  setTimeout(() => {
    const index = errorFields.value.indexOf(field);
    if (index > -1) {
      errorFields.value.splice(index, 1);
    }
    delete errorMessages[field];
  }, 2000);
};

// 移除错误提示
const removeError = (field) => {
  const index = errorFields.value.indexOf(field);
  if (index > -1) {
    errorFields.value.splice(index, 1);
  }
  delete errorMessages[field];
};

// 组件卸载前清除定时器
onBeforeUnmount(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
});
</script>

<style lang="scss" scoped>
/* 动画定义 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20rpx;
  padding: 40px 30px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  width: 100%;
  max-width: 400px;
  animation: fadeInUp 0.6s ease-out;
}

.logo-section {
  text-align: center;
  margin-bottom: 30px;
}

.logo {
  font-size: 60px;
  margin-bottom: 15px;
  animation: float 3s ease-in-out infinite;
}

.title {
  display: block;
  color: #333;
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 8px;
}

.subtitle {
  display: block;
  color: #666;
  font-size: 14px;
}

.input-group {
  margin-bottom: 20px;
}

.input-label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 500;
  font-size: 14px;
}

.input-group input {
  width: 100%;
  padding: 15px;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s ease;
  background-color: #f8f9fa;
}

.input-group input:focus {
  outline: none;
  border-color: #667eea;
  background-color: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.input-group input.input-error {
  border-color: #ff6b6b !important;
  background-color: #ffecec !important;
}

.error-message {
  color: #ff6b6b;
  font-size: 12px;
  margin-top: 5px;
  text-align: left;
  display: block;
}

.login-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-bottom: 25px;
  &::after { border: none; }
}

.login-btn:active:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
}

.login-btn:disabled {
  opacity: 0.7;
}

/* 登录方式切换按钮 */
.login-method-toggle {
  display: flex;
  background: #f0f2f5;
  border-radius: 12px;
  padding: 5px;
  margin-bottom: 25px;
}

.toggle-btn {
  flex: 1;
  padding: 12px;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  color: #666;
  &::after { border: none; }
}

.toggle-btn.active {
  background: white;
  color: #667eea;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.code-input-container {
  display: flex;
  gap: 10px;
}

.code-input-container input {
  flex: 1;
}

.get-code-btn {
  padding: 15px 10px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  white-space: nowrap;
  &::after { border: none; }
}

.get-code-btn:active:not(:disabled) {
  background: #5a6fd8;
}

.get-code-btn:disabled {
  opacity: 0.7;
}

.forgot-password-container {
  text-align: center;
  margin: 15px 0;
}

.forgot-password {
  color: #667eea;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
}

.forgot-password:active {
  text-decoration: underline;
}

.new-user-hint {
  text-align: center;
  color: #666;
  font-size: 14px;
  margin-top: 20px;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .login-card {
    padding: 30px 20px;
  }
  
  .logo {
    font-size: 50px;
  }
  
  .title {
    font-size: 24px;
  }
}
</style>