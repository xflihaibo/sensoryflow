---
title: 'Fix: Vite ESM Build Error in sensory-flow'
type: note
permalink: sensory/debug/fix-vite-esm-build-error-in-sensory-flow
tags:
- build-fix
- vite
- esm
---

Fixed Vite build error: '"vite-plugin-static-copy" resolved to an ESM file. ESM file cannot be loaded by require'.
Solution: Added '"type": "module"' to package.json to ensure Node.js treats the project as ESM.
Also fixed a warning in src/popup/index.html by adding 'type="module"' to the script tag.
Verified successful build with 'npm run build'. All assets and manifest.json are correctly copied to the dist folder.