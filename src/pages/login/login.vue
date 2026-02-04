<template>
  <view class="container">
    <view class="login-box" :class="{ 'fade-in': showPage }">
      
      <view class="header">
        <image class="logo" src="/static/logo.png" mode="aspectFit" />
        <text class="title">欢迎加入一起练</text>
        <text class="subtitle">输入手机号，开启你的健身之旅</text>
      </view>

      <view class="form">
        <view class="input-item">
          <input 
            type="number" 
            v-model="phone" 
            placeholder="请输入手机号" 
            maxlength="11"
            placeholder-class="placeholder"
          />
        </view>

        <view class="input-item code-row">
          <input 
            type="number" 
            v-model="code" 
            placeholder="验证码" 
            maxlength="6"
            placeholder-class="placeholder"
          />
          <view 
            class="get-code" 
            :class="{ 'disabled': countdown > 0 }" 
            @click="sendCode"
          >
            {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
          </view>
        </view>

        <button class="login-btn" @click="handleLogin">进入应用</button>
      </view>

      <view class="footer">
        <text>未注册手机号验证后将自动创建账号</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 页面显示状态
const showPage = ref(false);
// 响应式数据绑定 (类似 Java 对象的属性)
const phone = ref('');
const code = ref('');
const countdown = ref(0);

// 生命周期钩子：挂载后执行
onMounted(() => {
  // 必须使用 .value 来修改 ref 的值
  setTimeout(() => {
    showPage.value = true; 
  }, 100);
});

// 获取验证码逻辑
const sendCode = () => {
  if (countdown.value > 0) return;
  // 正则校验
  if (!/^1[3-9]\d{9}$/.test(phone.value)) {
    return uni.showToast({ title: '手机号格式不正确', icon: 'none' });
  }
  
  countdown.value = 60;
  const timer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) clearInterval(timer);
  }, 1000);
  
  uni.showToast({ title: '验证码已发送' });
};

// 登录处理逻辑
const handleLogin = () => {
  if (!phone.value || !code.value) {
    return uni.showToast({ title: '请填写完整信息', icon: 'none' });
  }
  
  uni.showLoading({ title: '登录中' });
  
  // 模拟接口请求
  setTimeout(() => {
    uni.hideLoading();
    uni.showToast({ title: '欢迎回来！', icon: 'success' });
    
    // 成功后跳转到首页
    uni.reLaunch({
      url: '/pages/index/index'
    });
  }, 1500);
};
</script>

<style lang="scss" scoped>
// 主题颜色变量
$theme-color: #00bfa5;

.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff; 
  padding: 0 60rpx;
  /* 确保整个页面在加载前不会闪烁 */
  overflow: hidden; 
}

.login-box {
  width: 100%;
  /* 初始状态：透明且向下偏移 20rpx */
  opacity: 0;
  transform: translateY(20rpx);
  /* 渐入过渡效果 */
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;

  /* 激活状态 */
  &.fade-in {
    opacity: 1;
    transform: translateY(0);
  }
}

.header {
  margin-bottom: 80rpx;
  text-align: left;

  .logo {
    width: 120rpx;
    height: 120rpx;
    margin-bottom: 40rpx;
    /* 给 Logo 加点平滑感 */
    border-radius: 20rpx;
  }
  .title {
    display: block;
    font-size: 52rpx;
    font-weight: bold;
    color: #333;
  }
  .subtitle {
    display: block;
    font-size: 28rpx;
    color: #999;
    margin-top: 16rpx;
  }
}

.form {
  .input-item {
    border-bottom: 1px solid #eeeeee;
    padding: 30rpx 0;
    margin-bottom: 30rpx;
    display: flex;
    align-items: center;

    input {
      flex: 1;
      font-size: 34rpx;
      color: #333;
    }
  }

  .code-row {
    .get-code {
      font-size: 28rpx;
      color: $theme-color;
      font-weight: 500;
      padding-left: 20rpx;
      
      &.disabled {
        color: #ccc;
      }
    }
  }

  .login-btn {
    margin-top: 80rpx;
    height: 100rpx;
    line-height: 100rpx;
    background-color: $theme-color;
    color: #fff;
    border-radius: 50rpx;
    font-size: 32rpx;
    font-weight: bold;
    /* 去除原生按钮边框 */
    &::after { border: none; }
    /* 点击效果 */
    &:active {
      opacity: 0.8;
    }
  }
}

.footer {
  margin-top: 80rpx;
  text-align: center;
  font-size: 24rpx;
  color: #bbb;
}

.placeholder {
  color: #ccc;
  font-size: 30rpx;
}
</style>