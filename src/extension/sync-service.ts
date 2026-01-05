import { SyncMessage } from '../types';

export class SyncService {
  /**
   * 广播消息到所有活动的标签页
   */
  static broadcastToTabs(message: SyncMessage) {
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        if (tab.id) {
          chrome.tabs.sendMessage(tab.id, message).catch(() => {
            // 忽略由于内容脚本未注入导致的错误
          });
        }
      });
    });
  }

  /**
   * 向后台脚本发送消息
   */
  static sendToBackground(message: SyncMessage): Promise<any> {
    return chrome.runtime.sendMessage(message);
  }

  /**
   * 监听消息
   */
  static onMessage(callback: (message: SyncMessage, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => void) {
    chrome.runtime.onMessage.addListener(callback);
  }
}
