// Sidepanel logic for TraceableAI

let currentImageUrl = null;

// DOM Elements
const imagePreview = document.getElementById('imagePreview');
const scanButton = document.getElementById('scanButton');
const scanningOverlay = document.getElementById('scanningOverlay');
const resultsContainer = document.getElementById('resultsContainer');
const statusText = document.getElementById('statusText');

// Listen for storage changes to detect new images
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local' && changes.currentImageUrl) {
    const newImageUrl = changes.currentImageUrl.newValue;
    if (newImageUrl) {
      loadImage(newImageUrl);
    }
  }
});

// Load existing image on panel open
chrome.storage.local.get(['currentImageUrl'], (result) => {
  if (result.currentImageUrl) {
    loadImage(result.currentImageUrl);
  }
});

// Load and display image
function loadImage(imageUrl) {
  currentImageUrl = imageUrl;
  
  // Update preview
  imagePreview.innerHTML = `
    <img src="${imageUrl}" alt="Tweet Image" class="preview-image">
  `;
  
  // Enable scan button
  scanButton.disabled = false;
  scanButton.classList.add('active');
  
  // Update status
  updateStatus('Image loaded - Ready to scan');
  
  // Clear previous results
  showPlaceholder();
}

// Update status text
function updateStatus(message) {
  statusText.textContent = message;
}

// Show results placeholder
function showPlaceholder() {
  resultsContainer.innerHTML = `
    <div class="results-placeholder">
      <div class="placeholder-icon">📊</div>
      <p>Awaiting scan results...</p>
    </div>
  `;
}

// Generate random trust score and metadata
function generateResults() {
  const trustScore = Math.floor(Math.random() * 100) + 1;
  const confidence = Math.floor(Math.random() * 30) + 70; // 70-100%
  
  const manipulationTypes = [
    'Face Swap Detection',
    'Facial Reenactment',
    'Audio-Visual Sync',
    'Texture Analysis',
    'Lighting Consistency',
    'Edge Detection'
  ];
  
  const artifacts = [
    { name: 'Facial Asymmetry', detected: Math.random() > 0.5, severity: Math.random() > 0.7 ? 'High' : 'Low' },
    { name: 'Lighting Inconsistencies', detected: Math.random() > 0.6, severity: Math.random() > 0.6 ? 'Medium' : 'Low' },
    { name: 'Compression Artifacts', detected: Math.random() > 0.4, severity: Math.random() > 0.5 ? 'Medium' : 'Low' },
    { name: 'Pixel Anomalies', detected: Math.random() > 0.7, severity: Math.random() > 0.8 ? 'High' : 'Medium' }
  ];
  
  const detectedArtifacts = artifacts.filter(a => a.detected);
  const scanType = manipulationTypes[Math.floor(Math.random() * manipulationTypes.length)];
  
  return {
    trustScore,
    confidence,
    scanType,
    artifacts: detectedArtifacts,
    timestamp: new Date().toLocaleString()
  };
}

// Display results
function displayResults(results) {
  const { trustScore, confidence, scanType, artifacts, timestamp } = results;
  
  // Determine verdict
  let verdict, verdictClass, verdictIcon;
  if (trustScore >= 70) {
    verdict = 'AUTHENTIC';
    verdictClass = 'authentic';
    verdictIcon = '✓';
  } else if (trustScore >= 40) {
    verdict = 'SUSPICIOUS';
    verdictClass = 'suspicious';
    verdictIcon = '⚠';
  } else {
    verdict = 'LIKELY MANIPULATED';
    verdictClass = 'manipulated';
    verdictIcon = '✗';
  }
  
  // Build artifacts HTML
  let artifactsHTML = '';
  if (artifacts.length > 0) {
    artifactsHTML = artifacts.map(artifact => `
      <div class="artifact-item">
        <span class="artifact-name">${artifact.name}</span>
        <span class="artifact-severity severity-${artifact.severity.toLowerCase()}">${artifact.severity}</span>
      </div>
    `).join('');
  } else {
    artifactsHTML = '<div class="no-artifacts">No significant artifacts detected</div>';
  }
  
  resultsContainer.innerHTML = `
    <div class="results-content">
      <!-- Trust Score Circle -->
      <div class="trust-score-container">
        <svg class="trust-circle" viewBox="0 0 160 160">
          <circle class="trust-circle-bg" cx="80" cy="80" r="70" />
          <circle class="trust-circle-progress" cx="80" cy="80" r="70" 
                  style="stroke-dashoffset: ${440 - (440 * trustScore) / 100}" />
        </svg>
        <div class="trust-score-text">
          <div class="score-number">${trustScore}</div>
          <div class="score-label">Trust Score</div>
        </div>
      </div>
      
      <!-- Verdict -->
      <div class="verdict ${verdictClass}">
        <span class="verdict-icon">${verdictIcon}</span>
        <span class="verdict-text">${verdict}</span>
      </div>
      
      <!-- Details Grid -->
      <div class="details-grid">
        <div class="detail-item">
          <div class="detail-label">Confidence</div>
          <div class="detail-value">${confidence}%</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Scan Type</div>
          <div class="detail-value">${scanType}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Timestamp</div>
          <div class="detail-value">${timestamp}</div>
        </div>
      </div>
      
      <!-- Artifacts Detected -->
      <div class="artifacts-section">
        <div class="artifacts-title">Detected Artifacts</div>
        <div class="artifacts-list">
          ${artifactsHTML}
        </div>
      </div>
    </div>
  `;
}

// Perform scan animation and show results
function performScan() {
  if (!currentImageUrl) return;
  
  // Disable scan button during scan
  scanButton.disabled = true;
  scanButton.innerHTML = '<span class="button-icon">⏳</span><span>Scanning...</span>';
  
  // Update status
  updateStatus('Analyzing image...');
  
  // Show scanning overlay
  scanningOverlay.classList.remove('hidden');
  
  // Simulate 3-second scan
  setTimeout(() => {
    // Hide scanning overlay
    scanningOverlay.classList.add('hidden');
    
    // Generate and display results
    const results = generateResults();
    displayResults(results);
    
    // Re-enable button
    scanButton.disabled = false;
    scanButton.innerHTML = '<span class="button-icon">⚡</span><span>Rescan Image</span>';
    
    // Update status
    updateStatus('Scan complete');
  }, 3000);
}

// Event Listeners
scanButton.addEventListener('click', performScan);

// Initialize
updateStatus('Ready');