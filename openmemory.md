# SensoryFlow (感官流) - OpenMemory Guide

## Overview
SensoryFlow is a Google Chrome extension designed to enhance the web browsing experience by injecting immersive visual atmospheres (filters and interactive effects) based on user-selected modes.

## Architecture

### 3.1 Settings & Sync (控制与同步)
- **Mechanism**: Manages `SensorySettings` through a glassmorphism Popup UI.
- **State**: Uses `chrome.storage.local` for persistence in the background script.
- **Broadcast**: Real-time broadcast of settings updates to all active tabs using `SyncService`.

### 3.2 Visual Layer (表现层)
- **Isolation**: Uses **Shadow DOM** to inject layers (Canvas/SVG) without polluting page styles.
- **Layers**:
  - **Canvas Layer**: Renders high-performance particle effects and mode-specific animations (Matrix rain, fish, petals, stars).
  - **Filter Layer**: Applies `backdrop-filter` using dynamically generated SVG filters from `FilterPool`.
- **Performance**:
  - GPU acceleration via `will-change: transform`.
  - Real-time FPS monitoring with automatic performance mode degradation (DPR scaling, particle reduction).

## User Defined Namespaces
- **extension**: Extension-specific logic (manifest, background, popup).
- **visual**: SVG filters, Canvas rendering, and Shadow DOM injection.
- **logic**: Page analysis (legacy), state management, and mode handling.

## Components
- **FilterPool**: Collection of pre-configured SVG filters (Cyber Interface, Paper Texture, Water Ripples, Galaxy, Zen) with intensity mapping.
- **SyncService**: Centralized utility for Chrome runtime messaging and state synchronization.
- **OverlayManager**: Shadow DOM isolation host for Canvas and SVG filters.
- **AnimationEngine**: High-performance RAF-based rendering engine with built-in FPS monitoring and automatic performance degradation.

## Patterns
- **Shadow DOM Isolation Pattern**: Creating a closed shadow root at `document.documentElement` to host overlay content, ensuring zero CSS leakage.
- **State Synchronization Pattern**: Using a centralized background script to persist state in `chrome.storage.local` and broadcast updates to all active content scripts via `SyncService`.
- **Graceful Performance Degradation**: Monitoring FPS and automatically reducing particle density, disabling complex filters, or scaling resolution (DPR) on low-end devices.
- **Dynamic Backdrop Filtering**: Applying CSS `backdrop-filter` to a layer inside Shadow DOM to affect the host page's content.
