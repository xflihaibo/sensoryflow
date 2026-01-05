import { SyncService } from '../extension/sync-service';
import { SensorySettings, SensoryMode } from '../types';

document.addEventListener('DOMContentLoaded', () => {
  const modeDisplay = document.getElementById('mode-display')!;
  const intensityInput = document.getElementById('intensity') as HTMLInputElement;
  const modeButtons = document.querySelectorAll('.mode-btn');
  const spotlightToggle = document.getElementById('spotlight-toggle') as HTMLInputElement;
  const velocityToggle = document.getElementById('velocity-toggle') as HTMLInputElement;
  const timeAwareToggle = document.getElementById('time-aware-toggle') as HTMLInputElement;

  let currentSettings: SensorySettings;

  // 获取当前设置
  SyncService.sendToBackground({ type: 'GET_SETTINGS' }).then((response) => {
    if (response && response.settings) {
      currentSettings = response.settings;
      updateUI(currentSettings);
    }
  });

  // 更新 UI 状态
  const updateUI = (settings: SensorySettings) => {
    // 更新文字显示
    const modeLabels: Record<SensoryMode, string> = {
      reading: '悦读模式',
      coding: '极客模式',
      creative: '灵感模式',
      zen: '禅意模式',
      galaxy: '银河模式',
      off: '已关闭'
    };
    modeDisplay.textContent = modeLabels[settings.mode];

    // 更新滑块
    intensityInput.value = settings.intensity.toString();

    // 更新开关状态
    spotlightToggle.checked = settings.enableSpotlight;
    velocityToggle.checked = settings.enableVelocity;
    timeAwareToggle.checked = settings.enableTimeAware;

    // 更新按钮状态
    modeButtons.forEach(btn => {
      if (btn.getAttribute('data-mode') === settings.mode) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  };

  // 保存设置
  const saveSettings = () => {
    SyncService.sendToBackground({
      type: 'UPDATE_SETTINGS',
      payload: currentSettings
    });
  };

  // 绑定事件
  intensityInput.addEventListener('input', () => {
    currentSettings.intensity = parseFloat(intensityInput.value);
    saveSettings();
  });

  spotlightToggle.addEventListener('change', () => {
    currentSettings.enableSpotlight = spotlightToggle.checked;
    saveSettings();
  });

  velocityToggle.addEventListener('change', () => {
    currentSettings.enableVelocity = velocityToggle.checked;
    saveSettings();
  });

  timeAwareToggle.addEventListener('change', () => {
    currentSettings.enableTimeAware = timeAwareToggle.checked;
    saveSettings();
  });

  modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-mode') as SensoryMode;
      currentSettings.mode = mode;
      
      // 如果选择“关闭”，同时关闭所有高级特效
      if (mode === 'off') {
        currentSettings.enableSpotlight = false;
        currentSettings.enableVelocity = false;
        currentSettings.enableTimeAware = false;
      }
      
      updateUI(currentSettings);
      saveSettings();
    });
  });
});
