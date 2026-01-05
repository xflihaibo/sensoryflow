---
title: '[Component] - SensoryFlow Core Architecture'
type: note
permalink: sensory/architecture/component-sensory-flow-core-architecture
tags:
- architecture
- chrome-extension
- svg-filters
---

SensoryFlow Architecture:
1. Sense Engine: URL/Meta analyzer (logic).
2. Visual Layer: Shadow DOM + SVG Filters + Offscreen Canvas (visual).
3. Laboratory Dashboard: Glassmorphism Popup (UI).

Key Technical Patterns:
- Shadow DOM isolation for overlays.
- SVG Filter pools for atmosphere.
- On-demand animation loops.
- chrome.storage.local for state management.