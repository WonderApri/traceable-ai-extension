//This script will listen to the button click from sites and tell Chrome to open the sidebar for this specific tab

// Background service worker for TraceableAI

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'open_sidebar') {
    const tabId = sender.tab.id;
    
    // Store the image URL in local storage
    chrome.storage.local.set({
      currentImageUrl: message.imageUrl,
      timestamp: Date.now()
    }, () => {
      // Open the side panel for this specific tab
      chrome.sidePanel.open({ tabId: tabId }, () => {
        if (chrome.runtime.lastError) {
          console.error('Error opening side panel:', chrome.runtime.lastError);
        } else {
          console.log('Side panel opened successfully for tab:', tabId);
        }
      });
    });
    
    sendResponse({ success: true });
    return true; // Keep the message channel open for async response
  }
});

// Optional: Handle extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('TraceableAI extension installed');
});