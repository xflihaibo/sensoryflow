#  SensoryFlow (感官流)

SensoryFlow (感官流) —— 智能感官增强引擎设计方案
1. 项目愿景 (Overview)
SensoryFlow 是一款打破传统浏览器视觉体验的谷歌插件。它能像“视觉实验室”一样，根据当前网页的情绪（内容、类型）自动适配氛围滤镜和物理交互特效，将枯燥的网页浏览转化为一场沉浸式的数字感官之旅。
2. 核心场景与视觉风格 (Modes)
系统通过分析 URL 关键词和页面 Meta 信息，自动在以下三种模式间切换：
模式名称	触发场景	视觉表现 (Atmosphere)	交互特效 (Interaction)
悦读 (Reading)	博客、新闻、文档	柔和纸质纹理、低对比度暖色调	文字引力磁吸、段落划过光晕
极客 (Coding)	GitHub、技术论坛	故障风 (Glitch)、文字色差偏移	点击粒子喷溅、滚动动态模糊
灵感 (Creative)	设计门户、图库	动态噪点、流动渐变、玻璃拟态	水波纹效果、图片重力感应
3. 技术架构 (Architecture)
3.1 识别层 (Sense Engine)
关键词权重算法：扫描 document.title、meta[description] 和 URL。
状态管理：通过 chrome.storage.local 存储用户偏好的自定义参数。
3.2 表现层 (Visual Layer)
Shadow DOM 隔离：所有的视觉覆盖层（Canvas/SVG）均注入在 Shadow DOM 中，确保不污染原始页面的 CSS。
SVG Filters 滤镜池：预设多种高度优化的滤镜（如 feTurbulence 实现波纹，feColorMatrix 实现故障感）。
Offscreen Canvas：复杂的粒子特效在离屏画布渲染，通过 requestAnimationFrame 保证 60FPS。
3.3 控制层 (Laboratory Dashboard)
Popup UI：极致玻璃拟态面板，中心设有动态状态球（The Core），实时反映当前感官模式。
实时通信：利用 chrome.runtime.onMessage 实现 Popup 调节与 Content Script 渲染的零延迟同步。

4. 关键交互逻辑 (Data Flow)
页面加载：Content Script 启动，识别网页类型。
模式匹配：匹配对应的视觉预设（如：识别到 github.com -> 激活 极客模式）。
样式注入：注入对应的 SVG 滤镜和全局 Canvas 覆盖层。
实时交互：监听鼠标移动、点击、滚动，触发对应的物理引擎反馈。
动态调节：用户在 Popup 面板调整强度滑块，参数实时广播至所有标签页。

5. 性能优化策略 (Performance)
按需渲染：仅在用户有交互操作（移动/滚动）时才运行复杂的计算逻辑。
降级机制：检测用户设备性能，低端设备自动降低噪点密度或关闭实时物理模拟。
层合并：使用 will-change: transform 强制开启 GPU 加速。

6. 开发与构建 (Development)

### 6.1 安装依赖
```bash
npm install
```

### 6.2 开发模式
```bash
npm run watch
```

### 6.3 生产构建
```bash
npm run build
```

### 6.4 安装到 Chrome
1. 打开 Chrome 浏览器，访问 `chrome://extensions/`。
2. 开启右上角的“开发者模式”。
3. 点击“加载已解压的扩展程序”，选择项目中的 `dist` 目录（构建后生成）。

---

7. 结项状态 (Status)
- [x] 核心识别引擎 (Sense Engine)
- [x] Shadow DOM 视觉隔离层
- [x] SVG 滤镜池 (Coding/Reading/Creative)
- [x] 玻璃拟态控制面板 (Popup UI)
- [x] 跨组件状态同步
- [x] 官方 Logo 集成
