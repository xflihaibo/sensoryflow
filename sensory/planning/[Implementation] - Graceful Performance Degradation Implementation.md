---
title: '[Implementation] - Graceful Performance Degradation Implementation'
type: note
permalink: sensory/planning/implementation-graceful-performance-degradation-implementation
---

# Implementation - Graceful Performance Degradation

## Purpose
Automatically detect low FPS and downgrade the extension's performance mode to ensure a smooth user experience.

## Key Changes
- **AnimationEngine**: Added FPS calculation logic in the animation loop.
- **FPS Threshold**: Set to 40 FPS. If FPS drops below this for over a second, it dispatches an `fps-low` event.
- **Content Script**: Listens for `fps-low` and updates settings to `performanceMode: 'low'`.
- **Syncing**: Performance mode changes are synced back to the background script and broadcast to all tabs.

## Files
- `src/visual/animation-engine.ts`: FPS monitoring and event dispatch.
- `src/content/index.ts`: Event listener and settings update logic.
