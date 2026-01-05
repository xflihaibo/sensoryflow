---
title: '[Implementation] SensoryFlow Architecture'
type: note
permalink: implementation/implementation-sensory-flow-architecture
tags:
- architecture
- sync
- svg-filters
- esm-loading
---

# [Implementation] SensoryFlow Architecture
- **Purpose**: Overview of the extension's data flow and structure.
- **Key Decisions**:
  - **Sync-Service**: A static utility used to synchronize `SensorySettings` between Popup, Background, and Content scripts.
  - **FilterPool**: Centralized SVG filter generator using complex primitives (`feTurbulence`, `feDisplacementMap`, `feDiffuseLighting`).
  - **Shadow DOM**: Used for CSS isolation and as a host for visual layers.
  - **Dynamic Module Loading**: A `loader.ts` is used to dynamically import the content script as an ESM module in the target page context.
- **Memory Types**: [implementation]
- **Git Repo**: unknown
- **Git Branch**: unknown
- **Git Commit**: unknown