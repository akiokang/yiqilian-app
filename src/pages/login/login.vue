<template>
  <view class="page-container">
    <view :class="['login-content', { 'is-visible': isMounted }]">
      
      <view class="brand-header">
        <image class="logo-img" src="/static/logo.png" mode="aspectFit" />
        <view class="title-main">一起练</view>
        <view class="title-sub">做你组间歇最好的伙伴</view>
      </view>

      <view class="login-form">
        <view class="input-row">
          <input 
            v-model="loginForm.phone" 
            type="number" 
            placeholder="请输入手机号" 
            maxlength="11"
          />
        </view>

        <view class="input-row split">
          <input 
            v-model="loginForm.code" 
            type="number" 
            placeholder="验证码" 
            maxlength="6"
          />
          <text 
            :class="['code-btn', { 'disabled': timer > 0 }]" 
            @click="handleSendCode"
          >
            {{ timer > 0 ? `${timer}s` : '获取验证码' }}
          </text>
        </view>

        <button class="submit-btn" @click="doSubmit">登录</button>
      </view>

      <view class="page-footer">登录即代表同意用户协议</view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';

// --- 状态定义 ---
const isMounted = ref(false);
const timer = ref(0);
const loginForm = reactive({
  phone: '',
  code: ''
});

// --- 生命周期 ---
onMounted(() => {
  // 延迟触发渐入效果
  setTimeout(() => {
    isMounted.value = true;
  }, 50);
});

// --- 业务逻辑 ---

// 获取验证码
const handleSendCode = () => {
  if (timer.value > 0) return;
  if (!/^1[3-9]\d{9}$/.test(loginForm.phone)) {
    uni.showToast({ title: '手机号格式错误', icon: 'none' });
    return;
  }
  
  // 开启倒计时
  timer.value = 60;
  const interval = setInterval(() => {
    timer.value--;
    if (timer.value <= 0) clearInterval(interval);
  }, 1000);
  
  uni.showToast({ title: '已发送' });
};

// 执行登录
const doSubmit = () => {
  if (!loginForm.phone || !loginForm.code) {
    uni.showToast({ title: '请完善信息', icon: 'none' });
    return;
  }
  
  uni.showLoading({ title: '验证中...' });
  
  // 模拟请求成功
  setTimeout(() => {
    uni.hideLoading();
    uni.reLaunch({ url: '/pages/index/index' });
  }, 1000);
};
</script>

<style lang="scss" scoped>
/* 样式保持扁平化，方便后续修改 */
.page-container {
  min-height: 100vh;
  background-color: #ffffff;
  padding: 0 80rpx;
  display: flex;
  align-items: center;
}

.login-content {
  width: 100%;
  opacity: 0;
  transform: translateY(30rpx);
  transition: all 0.6s ease;

  &.is-visible {
    opacity: 1;
    transform: translateY(0);
  }
}

.brand-header {
  margin-bottom: 100rpx;
  .logo-img { width: 120rpx; height: 120rpx; border-radius: 24rpx; }
  .title-main { font-size: 56rpx; font-weight: bold; margin-top: 30rpx; color: #333; }
  .title-sub { font-size: 28rpx; color: #999; margin-top: 10rpx; }
}

.input-row {
  border-bottom: 1px solid #f0f0f0;
  padding: 30rpx 0;
  margin-bottom: 20rpx;
  display: flex;
  align-items: center;

  input { flex: 1; font-size: 32rpx; }

  &.split {
    justify-content: space-between;
    .code-btn {
      color: #00bfa5;
      font-size: 28rpx;
      font-weight: 500;
      &.disabled { color: #ccc; }
    }
  }
}

.submit-btn {
  margin-top: 80rpx;
  background-color: #00bfa5;
  color: #fff;
  border-radius: 12rpx;
  font-size: 32rpx;
  height: 90rpx;
  line-height: 90rpx;
  &::after { border: none; }
}

.page-footer {
  margin-top: 60rpx;
  text-align: center;
  font-size: 24rpx;
  color: #ccc;
}
</style>