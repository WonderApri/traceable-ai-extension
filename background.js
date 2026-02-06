//This script will listen to the button click from sites and tell Chrome to open the sidebar for this specific tab

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "open_sidebar") {
    // This opens the side panel specifically for the tab the user is on
    chrome.sidePanel.open({ tabId: sender.tab.id });
    
    // We send the image URL to the sidepanel so it knows what to analyze
    chrome.storage.local.set({ targetImageUrl: message.imgUrl });
  }
});