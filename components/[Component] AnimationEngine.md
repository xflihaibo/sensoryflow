---
title: '[Component] AnimationEngine'
type: note
permalink: components/component-animation-engine
tags:
- component
- canvas
- performance
- particles
---

# [Component] AnimationEngine - High-Performance Particle Engine
- **Location**: `src/visual/animation-engine.ts`
- **Purpose**: Renders real-time visual effects using Canvas 2D API.
- **Key Features**:
  - **FPS Monitoring**: Detects drops below 30FPS and triggers performance degradation.
  - **Dynamic Resolution**: Scales Canvas resolution (DPR) based on performance mode.
  - **Mode Specifics**:
    - Coding: Matrix rain, grid, scanning lines.
    - Creative: Water ripples, glowing blobs, interactive fish.
    - Reading: Breath light, ink dust particles.
    - Zen: Falling cherry blossom petals with wind physics.
    - Galaxy: Rotating stars, dynamic nebula clouds, meteorite trails.
  - **Global Effects**: Reading Spotlight, Velocity Trails, Time-Aware filters.
- **Memory Types**: [component]
- **Git Repo**: unknown
- **Git Branch**: unknown
- **Git Commit**: unknown