import { OverlayManager } from '../visual/overlay-manager';
import { SyncService } from '../extension/sync-service';
import { SenseManager } from '../logic/sense-manager';
import { FilterPool } from '../visual/filter-pool';
import { AnimationEngine } from '../visual/animation-engine';
import { SyncMessage, SensorySettings, SensoryMode } from '../types';

console.log('SensoryFlow Content Script Injected');

let overlayManager: OverlayManager;
let animationEngine: AnimationEngine;
let currentMode: SensoryMode = 'off';

const init = () => {
  try {
    console.log('SensoryFlow Engine Starting...');
    
    // 初始化覆盖层管理器
    overlayManager = new OverlayManager();

    // 获取初始设置
    SyncService.sendToBackground({ type: 'GET_SETTINGS' }).then((response) => {
      if (response && response.settings) {
        const settings = response.settings as SensorySettings;
        
        // 移除自动识别逻辑，完全尊重用户的选择
        // 如果 settings.mode 是 'off'，则直接应用 off 状态
        
        // 初始化渲染引擎
        const canvas = overlayManager.getCanvas();
        if (canvas) {
          animationEngine = new AnimationEngine(canvas, settings);
          animationEngine.start();
        }
        
        applySettings(settings);
      }
    });

    // 监听设置更新
    SyncService.onMessage((message: SyncMessage) => {
      if (message.type === 'UPDATE_SETTINGS' && message.payload) {
        applySettings(message.payload);
      }
    });

  } catch (error) {
    console.error('SensoryFlow failed to initialize:', error);
  }
};

const applySettings = (settings: SensorySettings) => {
  if (!overlayManager) return;

  console.log('SensoryFlow: Applying Settings', settings);

  // 更新滤镜容器
  const filterSvg = FilterPool.getFilter(settings.mode, settings.intensity);
  overlayManager.updateFilters(filterSvg);

  // 获取内部滤镜层
  const filterLayer = overlayManager.getFilterLayer();

  if (filterLayer) {
    const filterCSS = FilterPool.getFilterCSS(settings.mode);
    
    try {
      // 关键修复：在 Shadow DOM 内部应用滤镜
      filterLayer.style.backdropFilter = filterCSS;
      (filterLayer.style as any).webkitBackdropFilter = filterCSS;
      
      // 增加背景色补偿，让滤镜更明显
      if (settings.mode === 'reading') {
        filterLayer.style.backgroundColor = `rgba(255, 230, 180, ${settings.intensity * 0.15})`; // 更暖的纸张底色
      } else if (settings.mode === 'coding') {
        filterLayer.style.backgroundColor = `rgba(0, 20, 0, ${settings.intensity * 0.05})`;
      } else if (settings.mode === 'galaxy') {
        filterLayer.style.backgroundColor = `rgba(0, 5, 25, ${settings.intensity * 0.9})`; // 纯正的深蓝色背景
      } else if (settings.mode === 'zen') {
        filterLayer.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'; // 极致淡雅，几乎透明，确保强度拉满时背景无感
      } else {
        filterLayer.style.backgroundColor = 'transparent';
      }
      
      console.log(`SensoryFlow: Internal filter applied: ${filterCSS}`);
    } catch (e) {
      console.error('SensoryFlow: Failed to apply internal filter', e);
    }
  }

  // 更新渲染引擎配置
  if (animationEngine) {
    animationEngine.updateSettings(settings);
  }

  currentMode = settings.mode;
};

// 监听滚动事件以增强交互感
let scrollTimeout: any;
window.addEventListener('scroll', () => {
  if (currentMode === 'coding' && animationEngine) {
    // 滚动时增加一点位移感 (模拟动态模糊)
    const canvas = overlayManager.getCanvas();
    if (canvas) canvas.style.transform = `translateY(${Math.sin(Date.now() / 100) * 2}px)`;
    
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      if (canvas) canvas.style.transform = 'translateY(0)';
    }, 100);
  }
});

init();
