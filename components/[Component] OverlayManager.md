---
title: '[Component] OverlayManager'
type: note
permalink: components/component-overlay-manager
tags:
- component
- isolation
- shadow-dom
---

# [Component] OverlayManager - Shadow DOM Isolation Host
- **Location**: `src/visual/overlay-manager.ts`
- **Purpose**: Manages the injection of a closed Shadow DOM into the host page.
- **Key Features**:
  - Injects a `#sf-overlay-host` element at the root of the document.
  - Hosts a `Canvas` layer (z-index 2) and a `FilterLayer` (z-index 1).
  - Isolates plugin styles from the page's CSS.
  - Applies `backdrop-filter` to an internal div to affect the host content.
- **Memory Types**: [component]
- **Git Repo**: unknown
- **Git Branch**: unknown
- **Git Commit**: unknown