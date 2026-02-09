console.log("🚀 TraceableAI: Content Script Initialized");

function findImageInTweet(tweet) {
    // X.com often hides images inside nested divs or uses specific data-testids
    const img = tweet.querySelector('img[src*="media"]') || 
                tweet.querySelector('img[src*="twimg"]');
    return img ? img.src : null;
}

function injectAuditButtons() {
    const tweets = document.querySelectorAll('article[data-testid="tweet"]');
    
    tweets.forEach(tweet => {
        // Only inject if we haven't already
        if (tweet.querySelector('.traceable-audit-btn')) return;

        const actionBar = tweet.querySelector('[role="group"]');
        if (actionBar) {
            const btn = document.createElement('button');
            btn.className = 'traceable-audit-btn';
            btn.innerHTML = '🔍 Audit AI';
            
            // Professional Cyber-Industrial Style
            btn.style.cssText = `
                background: #00d4ff; 
                color: black; 
                border: none; 
                border-radius: 999px; 
                padding: 4px 12px; 
                margin-left: 10px; 
                cursor: pointer; 
                font-size: 12px; 
                font-weight: bold;
                transition: transform 0.2s;
            `;

            btn.onmouseenter = () => btn.style.transform = 'scale(1.1)';
            btn.onmouseleave = () => btn.style.transform = 'scale(1)';

            btn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const imgUrl = findImageInTweet(tweet);
                if (imgUrl) {
                    console.log("TraceableAI: Sending image to sidebar...", imgUrl);
                    chrome.runtime.sendMessage({ action: "open_sidebar", imgUrl: imgUrl });
                } else {
                    console.warn("TraceableAI: No image detected in this tweet container.");
                }
            };

            actionBar.appendChild(btn);
        }
    });
}

// Run immediately and then every 2 seconds to catch scrolling
injectAuditButtons();
setInterval(injectAuditButtons, 2000);