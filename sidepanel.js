// Listen for changes in our shared storage
chrome.storage.onChanged.addListener((changes) => {
  if (changes.targetImageUrl) {
    updateUI(changes.targetImageUrl.newValue);
  }
});

function updateUI(url) {
  document.getElementById('image-preview').src = url;
  // Here we would eventually call the real AI API
  simulateScan();
}

function simulateScan() {
  const score = document.getElementById('trust-score');
  let current = 0;
  const interval = setInterval(() => {
    current += Math.floor(Math.random() * 10);
    if (current >= 87) {
      score.innerText = '87%';
      clearInterval(interval);
    } else {
      score.innerText = current + '%';
    }
  }, 50);
}