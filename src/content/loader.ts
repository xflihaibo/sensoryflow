(async () => {
  // 动态导入编译后的真正的内容脚本
  // 注意：路径必须与 vite.config.ts 输出的路径一致
  const src = chrome.runtime.getURL('src/content.js');
  await import(src);
})();
