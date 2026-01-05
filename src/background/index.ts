import { SyncService } from '../extension/sync-service';
import { SensorySettings, SyncMessage } from '../types';

console.log('SensoryFlow Background Worker Initialized');

// 初始化默认设置
const DEFAULT_SETTINGS: SensorySettings = {
  mode: 'off',
  intensity: 0.5,
  enableSpotlight: false,
  enableVelocity: false,
  enableTimeAware: false
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ settings: DEFAULT_SETTINGS });
});

// 监听来自 Popup 或 Content Script 的消息
SyncService.onMessage((message: SyncMessage, sender, sendResponse) => {
  if (message.type === 'UPDATE_SETTINGS') {
    const newSettings = message.payload as SensorySettings;
    chrome.storage.local.set({ settings: newSettings }, () => {
      // 广播新设置给所有标签页
      SyncService.broadcastToTabs({
        type: 'UPDATE_SETTINGS',
        payload: newSettings
      });
      sendResponse({ success: true });
    });
    return true; // 保持通道开放以进行异步响应
  }

  if (message.type === 'GET_SETTINGS') {
    chrome.storage.local.get(['settings'], (result) => {
      sendResponse({ settings: result.settings || DEFAULT_SETTINGS });
    });
    return true;
  }
});
