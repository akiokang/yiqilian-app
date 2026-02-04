<template>
  <view class="home-container">
    <view class="welcome-section">
      <text class="greet">你好，</text>
      <text class="user-phone">{{ formatPhone(userStore.phone) }}</text>
    </view>

    <view class="main-content flex-center">
      <view class="card">
        <text class="card-title">今日建议</text>
        <text class="card-desc">登录鉴权已通过，开始你的训练吧！</text>
      </view>
    </view>

    <view class="action-footer">
      <button class="logout-btn" @click="handleLogout">退出当前账号</button>
    </view>
  </view>
</template>

<script setup>
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

// 简单的手机号脱敏（Java 程序员最爱的脱敏逻辑）
const formatPhone = (phone) => {
  if (!phone) return '游客';
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
};

// 退出登录逻辑
const handleLogout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        // 1. 清除 Pinia 内存和 Storage 磁盘数据
        userStore.clearInfo();
        // 2. 跳转回登录页
        uni.reLaunch({
          url: '/pages/login/login'
        });
      }
    }
  });
};
</script>

<style lang="scss" scoped>
.home-container {
  padding: 60rpx 40rpx;
  min-height: 100vh;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
}

.welcome-section {
  margin-top: 40rpx;
  .greet { font-size: 32rpx; color: #999; }
  .user-phone { font-size: 48rpx; font-weight: bold; color: #333; display: block; margin-top: 10rpx; }
}

.main-content {
  flex: 1;
  .card {
    width: 100%;
    background-color: #fff;
    padding: 40rpx;
    border-radius: 24rpx;
    box-shadow: 0 10rpx 30rpx rgba(0,0,0,0.05);
    .card-title { font-size: 36rpx; font-weight: bold; display: block; }
    .card-desc { font-size: 28rpx; color: #666; margin-top: 20rpx; display: block; }
  }
}

.action-footer {
  padding-bottom: 60rpx;
  .logout-btn {
    background-color: #ff4d4f;
    color: #fff;
    border-radius: 50rpx;
    font-size: 30rpx;
    height: 90rpx;
    line-height: 90rpx;
    &::after { border: none; }
  }
}
</style>