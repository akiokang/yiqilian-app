<script setup>
/**
 * App.vue - 应用入口组件
 * 作用：处理全局生命周期、全局初始化、首屏安全校验
 */
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';
import { useUserStore } from '@/stores/user';

// 实例化 Store（相当于 Java 中的全局单例 Service）
const userStore = useUserStore();

// 1. 应用初始化周期（类似 Spring 容器启动）
onLaunch(() => {
  console.log('App Launch: 执行全局初始化及鉴权校验');
  
  // A. 执行冷启动安全校验
  checkAuth();
  
  // B. 处理其他全局任务（如版本检查、静默登录等）
});

// 2. 应用进入前台
onShow(() => {
  console.log('App Show: 界面可见');
});

// 3. 应用进入后台
onHide(() => {
  console.log('App Hide: 应用切入后台');
});

/**
 * 安全校验逻辑
 * 确保应用启动时，若无 Token 则强制重定向至登录页
 */
const checkAuth = () => {
  // 从持久化存储中尝试恢复 Token（类似从 Redis 或 Cookie 获取）
  const token = uni.getStorageSync('token');
  const phone = uni.getStorageSync('phone');
  
  if (token) {
    // 同步到内存 Store，保证全局数据一致性
    userStore.setInfo(token, phone);
    console.log('Auth Success: 已自动恢复登录状态');
  } else {
    // 强制路由兜底：如果没有 Token，且当前不是登录页，则重定向
    console.warn('Auth Failed: 未检测到凭证，执行拦截');
    
    // 延迟执行以确保框架渲染引擎已准备就绪
    setTimeout(() => {
      // 检查当前页面是否已经是登录页，避免循环重定向
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      
      if (!currentPage || currentPage.route !== 'pages/login/login') {
        uni.reLaunch({
          url: '/pages/login/login'
        });
      }
    }, 200);
  }
};
</script>

<style lang="scss">
/* 这里是全局 CSS (类似 global.css)
  在这里定义的样式会作用于所有页面
*/

// 重置页面默认行为
page {
  background-color: #ffffff;
  color: #333;
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica,
    Segoe UI, Arial, Roboto, 'PingFang SC', 'miui', 'Hiragino Sans GB', 'Microsoft Yahei',
    sans-serif;
  -webkit-text-size-adjust: 100%;
}

// 定义一些大厂规范的全局工具类
.text-ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

// 按钮点击态全局配置
button:active {
  opacity: 0.8;
  transform: scale(0.98);
  transition: all 0.2s;
}
</style>