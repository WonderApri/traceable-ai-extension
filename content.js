console.log("🚀 TraceableAI: Content Script Loaded!");

function injectButton() {
  const tweets = document.querySelectorAll('article[data-testid="tweet"]:not(.traceable-checked)');
  
  tweets.forEach(tweet => {
    tweet.classList.add('traceable-checked');
    const actionBar = tweet.querySelector('[role="group"]');
    
    if (actionBar) {
      const btn = document.createElement('button');
      btn.innerText = "🔍 Audit AI";
      btn.style.cssText = "background: #1d9bf0; color: white; border: none; border-radius: 15px; padding: 5px 10px; margin-left: 10px; cursor: pointer; font-weight: bold;";
      
      btn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const img = tweet.querySelector('img[src*="media"]');
        const imgUrl = img ? img.src : null;

        console.log("Checking image:", imgUrl);

        if (imgUrl) {
          chrome.runtime.sendMessage({ action: "open_sidebar", imgUrl: imgUrl });
        } else {
          alert("No image found in this tweet!");
        }
      };
      
      actionBar.appendChild(btn);
    }
  });
}

// Run every 2 seconds to catch new tweets
setInterval(injectButton, 2000);