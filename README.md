一起练 前端项目架构文档 (V1.0)
================================

**版本**: V1.0

**概述**
- **核心定位**: 基于 Vue 3 (Composition API) + uni-app 的极简健身应用前端，目标是高可维护性、逻辑解耦、并实现大厂规范的鉴权闭环。
- **开发环境**: VS Code + Vite + Sass

**目录结构 (Directory Map)**
Plaintext
yiqilian-app/
├── src/
│   ├── api/             # 接口层：封装与 Java 后端的异步请求
│   ├── static/          # 资源层：Logo、图标、本地静态图片
│   ├── stores/          # 状态层：基于 Pinia 的全局数据单例（类似 Session）
│   ├── utils/           # 工具层：存放 Request 封装、格式化工具
│   ├── pages/           # 页面层：具体的业务模块
│   │   ├── login/       # 登录模块：极简短信验证登录 + 动态渐入动画
│   │   └── index/       # 首页模块：业务枢纽、用户信息展示、注销验证
│   ├── App.vue          # 根组件：全局生命周期管理、冷启动鉴权、全局样式
│   ├── main.js          # 入口文件：挂载 Pinia、激活路由守卫拦截器
│   ├── permission.js    # 路由守卫：AOP 思想实现的全局权限过滤器
│   └── pages.json       # 路由配置：定义页面路径及原生窗口表现
├── package.json         # 依赖管理：记录 pinia, sass, uni-ui 等版本
└── vite.config.js       # 构建配置：Vite 编译环境配置

**核心功能模块详细说明**

- **安全鉴权体系 (Security)**
	- **拦截器** (`src/permission.js`): 利用 `uni.addInterceptor` 或路由守卫实现页面跳转前拦截；除白名单（如登录页）外，所有路由检查 Pinia 或 Storage 中的 token，若无效或过期则重定向到登录页。
	- **冷启动校验** (`src/App.vue`): 在应用冷启动(onLaunch)阶段强制校验登录态并恢复会话，防止直接打开深链绕过鉴权。

- **全局状态管理 (State Management)**
	- **模块名**: `userStore`（示例位置：`src/stores/user.js`）
	- **核心字段**: `token`, `phone`, `profile`（可选）
	- **持久化**: 在写入 Pinia 的同时调用 `uni.setStorageSync` 持久化，重启时从 Storage 恢复到 Pinia。

- **UI 与交互规范 (UI/UX)**
	- **设计风格**: 极简、纯白、接近原生视觉适配 iOS/Android。
	- **动态效果**: 页面渐入使用 Vue 3 的生命周期（`onMounted`）配合 CSS transition 或 transform 实现；按钮状态、倒计时等使用响应式数据驱动。
	- **样式预处理**: 使用 Sass (SCSS)，抽象变量（色值、间距、字体）以便主题适配。

**技术栈清单 (Technology Stack)**
- **Vue 3**: ^3.4.x — Composition API 为主，逻辑可复用性强。
- **Pinia**: ^2.x — 轻量且推荐的全局状态管理方案。
- **uni-app**: ^3.x — 跨平台代码运行能力（小程序、H5、App）。
- **Sass (SCSS)**: ^1.x — 提高样式复用与维护性。
- **Vite**: ^5.x — 快速构建与热更新。

**开发备忘录**
- **依赖安装**: 若遇 peer 依赖冲突，可使用 `npm install --legacy-peer-deps`。
- **代码风格**: 严禁在页面中直接操作 DOM，应通过 `ref`/`reactive` 驱动 UI。组件职责单一、避免跨层级状态耦合。
- **鉴权流程**: 登录后将 `token` 写入 Pinia 并持久化；在 `permission.js` 中统一处理 token 失效与续期逻辑。
- **Git 规范**: 提交前确保 `node_modules` 与 `dist` 在 `.gitignore` 中；分支策略建议 `feature/*`, `release/*`, `hotfix/*`。

