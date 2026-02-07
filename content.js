// Content script for TraceableAI - Injects buttons on X.com

console.log('TraceableAI content script loaded');

// Function to extract image URL from tweet media
function getImageUrlFromTweet(tweetElement) {
  // Try to find image in the tweet
  const imgElement = tweetElement.querySelector('img[src*="media"]');
  if (imgElement) {
    return imgElement.src;
  }
  
  // Alternative: look for background images
  const mediaContainer = tweetElement.querySelector('[data-testid="tweetPhoto"]');
  if (mediaContainer) {
    const img = mediaContainer.querySelector('img');
    if (img) return img.src;
  }
  
  return null;
}

// Function to create and inject the "Scan Image" button
function injectScanButton(tweetElement) {
  // Check if button already exists
  if (tweetElement.querySelector('.traceable-ai-button')) {
    return;
  }
  
  // Only add button if tweet has media
  const hasMedia = tweetElement.querySelector('img[src*="media"]') || 
                   tweetElement.querySelector('[data-testid="tweetPhoto"]');
  
  if (!hasMedia) return;
  
  // Create button
  const button = document.createElement('button');
  button.className = 'traceable-ai-button';
  button.innerHTML = '🔍 Scan for Deepfake';
  button.style.cssText = `
    background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%);
    color: #000;
    border: none;
    padding: 6px 12px;
    border-radius: 16px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    margin: 8px 0;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 212, 255, 0.3);
  `;
  
  // Hover effects
  button.addEventListener('mouseenter', () => {
    button.style.transform = 'scale(1.05)';
    button.style.boxShadow = '0 4px 12px rgba(0, 212, 255, 0.5)';
  });
  
  button.addEventListener('mouseleave', () => {
    button.style.transform = 'scale(1)';
    button.style.boxShadow = '0 2px 8px rgba(0, 212, 255, 0.3)';
  });
  
  // Click handler
  button.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const imageUrl = getImageUrlFromTweet(tweetElement);
    
    if (imageUrl) {
      // Send message to background script to open sidebar
      chrome.runtime.sendMessage({
        type: 'open_sidebar',
        imageUrl: imageUrl
      }, (response) => {
        if (response && response.success) {
          console.log('Sidebar opened with image:', imageUrl);
          button.innerHTML = '✓ Scanning...';
          button.style.background = 'linear-gradient(135deg, #00ff88 0%, #00cc66 100%)';
          
          setTimeout(() => {
            button.innerHTML = '🔍 Scan for Deepfake';
            button.style.background = 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)';
          }, 2000);
        }
      });
    } else {
      alert('No image found in this tweet');
    }
  });
  
  // Find the action bar in the tweet and insert button
  const actionBar = tweetElement.querySelector('[role="group"]');
  if (actionBar) {
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = 'display: flex; align-items: center; margin-left: 12px;';
    buttonContainer.appendChild(button);
    actionBar.appendChild(buttonContainer);
  }
}

// Observer to detect new tweets being loaded
const observer = new MutationObserver((mutations) => {
  // Find all tweet articles
  const tweets = document.querySelectorAll('article[data-testid="tweet"]');
  
  tweets.forEach(tweet => {
    injectScanButton(tweet);
  });
});

// Start observing the document
observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Initial injection for already loaded tweets
setTimeout(() => {
  const tweets = document.querySelectorAll('article[data-testid="tweet"]');
  tweets.forEach(tweet => {
    injectScanButton(tweet);
  });
}, 1000);