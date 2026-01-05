# SensoryFlow 任务清单

## 1. 基础架构与清单配置
- [x] 1.1 初始化项目结构与 Manifest V3 配置
  - 文件：`manifest.json`, `package.json`
  - 任务：配置插件权限（storage, tabs, activeTab）、入口文件（background, content, popup）及资源声明。
  - 目的：建立 Chrome 扩展的基础运行环境。
  - _要求：4.3_
  - _Prompt: Role: Chrome 扩展开发专家 | Task: 初始化 SensoryFlow 项目，配置 Manifest V3，包含必要的权限声明（storage, scripting, tabs）及内容脚本与后台脚本的路径配置 | Restrictions: 严格遵循 MV3 规范，确保 package.json 包含必要的构建脚本 | Success: 插件可以成功加载到 Chrome 浏览器且无错误。_

## 2. 后台脚本与状态管理 (Logic Layer)
- [x] 2.1 实现 Background Script 状态管理与消息广播
  - 文件：`src/background/index.ts`, `src/extension/sync-service.ts`
  - 任务：实现全局状态存储及标签页之间的消息转发逻辑。
  - 目的：确保 Popup 的修改能同步到所有活动的 Content Script。
  - _要求：3.3, 4.2_
  - _Prompt: Role: 后端架构师 (浏览器扩展) | Task: 实现后台脚本的消息监听与广播机制，使用 SyncService 处理 chrome.runtime 通信，并持久化用户偏好设置到 chrome.storage | Restrictions: 避免不必要的轮询，使用事件驱动模式 | Success: Popup 发送的消息能被后台捕获并转发给所有活动标签页。_

## 3. 内容脚本与视觉隔离 (Visual Layer)
- [x] 3.1 实现 Shadow DOM 注入与 Overlay 管理
  - 文件：`src/visual/overlay-manager.ts`, `src/content/index.ts`
  - 任务：在宿主页面注入 `sensory-flow-root` 节点，并附加封闭的 Shadow Root，用于承载视觉元素。
  - 目的：实现视觉效果与原网页样式的完全隔离。
  - _要求：3.2, 5.2_
  - _Prompt: Role: 前端架构师 (隔离技术) | Task: 开发 OverlayManager，实现在页面中创建 Shadow Root，并注入基础的 Canvas 和 SVG 容器，确保 Z-index 足够 high 且不干扰 pointer-events | Restrictions: 不得污染宿主页面的全局 CSS，确保 Shadow DOM 模式为 'closed' | Success: 页面上出现全屏覆盖层，且不影响原网页的交互。_

- [x] 3.2 实现感官引擎 SenseManager
  - 文件：`src/logic/sense-manager.ts`
  - 任务：编写扫描逻辑，分析 `document.title`、`meta` 标签和 URL，返回匹配的模式。
  - 目的：实现自动化模式切换。
  - _要求：3.1, 5.1_
  - _Prompt: Role: NLP/数据分析工程师 | Task: 实现 SenseManager 类，通过正则表达式和关键词权重算法分析页面元数据，识别“极客”、“悦读”、“灵感”三种模式 | Restrictions: 扫描过程需高效，不得造成页面卡顿 | Success: 针对不同域名（如 github.com, medium.com）能准确返回对应的模式字符串。_

## 4. 视觉特效实现 (Atmosphere)
- [x] 4.1 构建 SVG 滤镜池 (FilterPool)
  - 文件：`src/visual/filter-pool.ts`
  - 任务：实现三种模式对应的 SVG 滤镜字符串生成器。
  - 目的：提供核心的氛围特效支持。
  - _要求：3.2, 5.1_
  - _Prompt: Role: SVG/图形工程师 | Task: 编写 FilterPool 类，包含 feTurbulence, feColorMatrix 等滤镜组合，实现故障风、纸质纹理和流体特效的 SVG 定义 | Restrictions: 滤镜参数需可调节（通过强度滑块） | Success: 生成的 SVG 滤镜能被 Canvas 或 CSS 正确引用并产生预期视觉效果。_

- [x] 4.2 开发高性能渲染引擎 (AnimationEngine)
  - 文件：`src/visual/animation-engine.ts`
  - 任务：基于 `requestAnimationFrame` 实现 Canvas 渲染循环，处理粒子和动态模糊。
  - 目的：确保视觉特效的流畅度。
  - _要求：3.2, 4.1_
  - _Prompt: Role: 游戏/图形开发工程师 | Task: 实现 AnimationEngine，处理不同模式下的 Canvas 绘图逻辑，支持粒子系统和基于滚动的动态模糊，并集成性能降级机制 | Restrictions: 必须锁定在 60FPS，在低端设备上自动减少粒子数 | Success: 在复杂网页上滚动时，视觉特效平滑无掉帧。_

## 5. 用户界面 (Control Layer)
- [x] 5.1 开发玻璃拟态 Popup 界面
  - 文件：`src/popup/index.tsx`, `src/popup/style.css`
  - 任务：构建包含模式显示和强度调节滑块的 UI。
  - 目的：提供用户交互入口。
  - _要求：3.3_
  - _Prompt: Role: UI/UX 开发工程师 | Task: 使用 React/HTML+CSS 开发玻璃拟态风格的 Popup 界面，实现滑块与后台脚本的实时数据绑定 | Restrictions: 严格遵循玻璃拟态视觉风格，使用 backdrop-filter | Success: 界面美观，调节滑块时能实时触发状态广播。_

## 6. 集成与测试
- [x] 6.1 完成端到端集成与性能优化
  - 任务：整合所有组件，在不同类型的网站上进行实测。
  - 目的：确保系统稳定性和性能达标。
  - _要求：5.1, 5.3, 5.4_
  - _Prompt: Role: 高级全栈开发工程师 | Task: 进行全流程测试，修复跨域注入、CSP 限制等兼容性问题，并使用 Chrome DevTools 进行 Performance Profiling 优化 | Success: 所有模式切换正常，多标签页同步正常，平均帧率保持在 50FPS 以上。_
