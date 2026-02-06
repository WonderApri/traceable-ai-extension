const addVerifyButtons = () => {
  // Find all image containers on Twitter/X
  const images = document.querySelectorAll('div[data-testid="tweetPhoto"]:not(.tai-processed)');

  images.forEach((imgContainer) => {
    imgContainer.classList.add('tai-processed'); // Mark as processed
    
    // Create the "Verify" button
    const btn = document.createElement('button');
    btn.innerText = '🔍 Audit AI';
    btn.className = 'tai-verify-btn';
    
    btn.onclick = (e) => {
      e.stopPropagation();
      e.preventDefault();
  
      // Find the actual image URL
      const imgElement = imgContainer.querySelector('img');
      const imgUrl = imgElement ? imgElement.src : '';

      // "Whisper" to the background script to open the sidebar
      chrome.runtime.sendMessage({
        action: "open_sidebar",
        imgUrl: imgUrl
      });
    };
  });
};

// Run every time the page content changes (scrolling)
const observer = new MutationObserver(addVerifyButtons);
observer.observe(document.body, { childList: true, subtree: true });
addVerifyButtons();