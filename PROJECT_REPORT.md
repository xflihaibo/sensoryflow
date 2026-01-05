# SensoryFlow (感官流) 项目开发总结报告

## 1. 项目概述 (Project Overview)
SensoryFlow 是一款创新的 Chrome 浏览器插件，旨在通过动态的视觉滤镜和物理交互特效，为用户提供沉浸式的网页浏览体验。它不仅是一个视觉工具，更是一个根据用户需求（模式切换）调节网页氛围的“感官引擎”。

## 2. 核心功能与模式 (Core Features)

### 2.1 五大交互模式
- **极客模式 (Cyber Interface)**：赛博朋克风，包含色差偏移、数字雨（Matrix）、网格扫描线及故障（Glitch）动效。
- **灵感模式 (Aurora Fluid)**：水波涟漪效果，带有半透明流体背景、气泡以及跟随鼠标游动的灵性小鱼。
- **悦读模式 (Paper Texture)**：模拟羊皮纸质感，护眼暖色调，带有微弱的墨尘粒子和呼吸感光晕。
- **禅意模式 (Zen Mode)**：极致淡雅，伴随落樱（花瓣）随风飘动，提供极致静谧的沉浸感。
- **银河模式 (Galaxy Mode)**：深邃星空背景，动态星系旋转，偶尔有流星滑过，模拟宇宙的宏大运转。

### 2.2 全局增强特效
- **阅读聚光灯 (Focus Spotlight)**：营造暗色背景下的局部高亮区域，引导注意力。
- **滚动速度线 (Velocity Trails)**：快速滚动时产生动态线条，增强网页浏览的速度感。
- **时间感知滤镜 (Time-Aware Filter)**：根据当前时间自动叠加极轻微的色调（如傍晚的暖橙色），感知时间流动。

## 3. 技术方案 (Technical Architecture)

### 3.1 视觉隔离与注入 (Shadow DOM)
采用 **Shadow DOM** 技术将所有的 Canvas 渲染层和 SVG 滤镜容器封装在独立的 Shadow Root 中。
- **优点**：确保插件样式与原始页面 CSS 互不干扰，完美适配任何复杂的网页结构（如 GitHub、知乎、Twitter 等）。

### 3.2 动态滤镜系统 (SVG Filter Pool)
利用 SVG 滤镜原语（Filter Primitives）实现复杂的视觉处理：
- 使用 `feTurbulence` 和 `feDisplacementMap` 实现水波纹和故障位移。
- 使用 `feColorMatrix` 进行精确的色彩分层和色调控制。
- 使用 `feGaussianBlur` 提供平滑的景深感。

### 3.3 高性能动画引擎 (Animation Engine)
- **渲染基石**：基于 `requestAnimationFrame` 的 60FPS 渲染循环。
- **物理模拟**：实现了流体、引力、弹性碰撞等基础物理反馈。
- **性能降级 (Graceful Degradation)**：内置实时 FPS 监测器，当帧率低于 30FPS 时，自动降低分辨率（DPR）并削减粒子数量，确保流畅度。

## 4. 交互设计 (Interaction & UX)
- **玻璃拟态 UI**：Popup 面板采用毛玻璃质感，提供直观的感官强度（Intensity）调节和性能模式切换。
- **实时同步**：基于 `chrome.runtime.onMessage` 的消息总线，确保面板上的每一次滑动都能实时反馈在网页上。

## 5. 项目状态 (Status)
- [x] 核心引擎开发完成
- [x] 5 种核心模式及其对应的 SVG/Canvas 动效
- [x] 全局扩展特效（聚光灯、速度线、时间感知）
- [x] 性能自动降级系统
- [x] 极致精简的 Popup 控制面板
