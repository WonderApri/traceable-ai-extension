// Background service worker for TraceableAI

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // 1. Matches the 'action' key from content.js
  if (message.action === 'open_sidebar') {
    const tabId = sender.tab.id;
    
    // 2. Store the image URL using the key 'activeImg' (which our sidepanel uses)
    chrome.storage.local.set({
      activeImg: message.imgUrl, 
      currentImageUrl: message.imgUrl, // Keeping both just in case
      timestamp: Date.now()
    }, () => {
      // 3. Open the side panel
      chrome.sidePanel.open({ tabId: tabId })
        .then(() => {
          console.log('TraceableAI: Side panel opened for tab:', tabId);
        })
        .catch((error) => {
          console.error('TraceableAI: Error opening side panel:', error);
        });
    });
    
    sendResponse({ success: true });
    return true; 
  }
});

chrome.runtime.onInstalled.addListener(() => {
  console.log('TraceableAI: Extension installed and background worker active.');
});