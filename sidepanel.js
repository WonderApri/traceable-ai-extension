// Sidepanel logic for TraceableAI with Proxy Server

let currentImageUrl = null;

// ============================================
// PROXY SERVER CONFIGURATION
// ============================================
// Replace YOUR-USERNAME with your actual Hugging Face username
const PROXY_ENDPOINT = "https://Aparajita300-traceable-ai-proxy.hf.space/verify";

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

// ============================================
// HUGGING FACE API INTEGRATION
// ============================================

/**
 * Fetch image from URL and convert to Blob
 */
async function fetchImageAsBlob(imageUrl) {
  try {
    // Fetch the image
    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }
    
    // Convert to blob
    const blob = await response.blob();
    
    // Check file size (Hugging Face has limits, typically ~10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (blob.size > maxSize) {
      throw new Error(`Image too large (${(blob.size / 1024 / 1024).toFixed(2)}MB). Maximum size is 10MB.`);
    }
    
    return blob;
  } catch (error) {
    console.error('Error fetching image:', error);
    throw error;
  }
}

/**
 * Send image to Proxy Server for AI detection
 */
async function analyzeImageWithProxy(imageBlob) {
  try {
    const response = await fetch(PROXY_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream'
      },
      body: imageBlob
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Handle specific error cases
      if (response.status === 503) {
        throw new Error('Model is currently loading. Please try again in 20-30 seconds.');
      } else if (response.status === 500) {
        throw new Error('Proxy server error. Please try again later.');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.');
      } else {
        throw new Error(errorData.error || `Proxy error: ${response.status}`);
      }
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Proxy server error:', error);
    throw error;
  }
}

/**
 * Parse Proxy Server response and format results
 */
function parseProxyResults(apiResponse) {
  // The API returns an array of predictions like:
  // [
  //   { "label": "artificial", "score": 0.8234 },
  //   { "label": "human", "score": 0.1766 }
  // ]
  
  if (!Array.isArray(apiResponse) || apiResponse.length === 0) {
    throw new Error('Invalid API response format');
  }
  
  // Sort by score to get the top prediction
  const sortedResults = apiResponse.sort((a, b) => b.score - a.score);
  const topPrediction = sortedResults[0];
  
  const label = topPrediction.label.toLowerCase();
  const confidence = Math.round(topPrediction.score * 100);
  
  // Determine if it's AI-generated or human-made
  const isArtificial = label === 'artificial' || label === 'ai' || label === 'fake';
  
  // Calculate trust score (inverse of artificial confidence)
  // If artificial: low trust score
  // If human: high trust score
  const trustScore = isArtificial ? Math.max(5, 100 - confidence) : confidence;
  
  return {
    trustScore: trustScore,
    confidence: confidence,
    verdict: isArtificial ? 'LIKELY AI-GENERATED' : 'LIKELY AUTHENTIC',
    verdictClass: isArtificial ? 'manipulated' : 'authentic',
    rawLabel: topPrediction.label,
    allPredictions: sortedResults,
    timestamp: new Date().toLocaleString()
  };
}

// ============================================
// DISPLAY RESULTS
// ============================================

/**
 * Display analysis results in the UI
 */
function displayResults(results) {
  const { trustScore, confidence, verdict, verdictClass, rawLabel, allPredictions, timestamp } = results;
  
  // Determine color based on verdict
  let scoreColor, verdictIcon;
  if (verdictClass === 'authentic') {
    scoreColor = '#00ff88'; // Green
    verdictIcon = '✓';
  } else if (verdictClass === 'manipulated') {
    scoreColor = '#ff4444'; // Red
    verdictIcon = '✗';
  } else {
    scoreColor = '#ffcc00'; // Yellow
    verdictIcon = '⚠';
  }
  
  // Build predictions HTML
  let predictionsHTML = '';
  if (allPredictions && allPredictions.length > 0) {
    predictionsHTML = allPredictions.map(pred => {
      const predScore = Math.round(pred.score * 100);
      const barWidth = predScore;
      const labelColor = pred.label.toLowerCase() === 'artificial' ? '#ff4444' : '#00ff88';
      
      return `
        <div class="prediction-item">
          <div class="prediction-header">
            <span class="prediction-label" style="color: ${labelColor}">${pred.label.toUpperCase()}</span>
            <span class="prediction-score">${predScore}%</span>
          </div>
          <div class="prediction-bar-container">
            <div class="prediction-bar" style="width: ${barWidth}%; background: ${labelColor}"></div>
          </div>
        </div>
      `;
    }).join('');
  }
  
  resultsContainer.innerHTML = `
    <div class="results-content">
      <!-- Trust Score Circle -->
      <div class="trust-score-container">
        <svg class="trust-circle" viewBox="0 0 160 160">
          <circle class="trust-circle-bg" cx="80" cy="80" r="70" />
          <circle class="trust-circle-progress" cx="80" cy="80" r="70" 
                  style="stroke: ${scoreColor}; stroke-dashoffset: ${440 - (440 * trustScore) / 100}; filter: drop-shadow(0 0 10px ${scoreColor})" />
        </svg>
        <div class="trust-score-text">
          <div class="score-number" style="color: ${scoreColor}; text-shadow: 0 0 15px ${scoreColor}">${trustScore}</div>
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
          <div class="detail-label">Detection Type</div>
          <div class="detail-value">AI vs Human</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Timestamp</div>
          <div class="detail-value">${timestamp}</div>
        </div>
      </div>
      
      <!-- Predictions Breakdown -->
      <div class="artifacts-section">
        <div class="artifacts-title">Model Predictions</div>
        <div class="predictions-list">
          ${predictionsHTML}
        </div>
      </div>
      
      <!-- API Info -->
      <div class="api-info">
        <div class="api-info-text">
          <span class="api-badge">🔒 Secured via Proxy</span>
          <span class="model-name">Model: Ateeqq/ai-vs-human-image-detector</span>
        </div>
      </div>
    </div>
  `;
}

/**
 * Display error message
 */
function displayError(errorMessage) {
  resultsContainer.innerHTML = `
    <div class="results-content">
      <div class="error-container">
        <div class="error-icon">⚠️</div>
        <div class="error-title">Analysis Failed</div>
        <div class="error-message">${errorMessage}</div>
        <div class="error-suggestions">
          <p><strong>Suggestions:</strong></p>
          <ul>
            <li>Check your internet connection</li>
            <li>Ensure the image is under 10MB</li>
            <li>Wait 20-30 seconds if the model is loading</li>
            <li>Try a different image</li>
            <li>Verify the proxy server is running</li>
          </ul>
        </div>
      </div>
    </div>
  `;
}

// ============================================
// MAIN SCAN FUNCTION
// ============================================

/**
 * Perform real AI detection scan using Proxy Server
 */
async function performScan() {
  if (!currentImageUrl) return;
  
  // Disable scan button during scan
  scanButton.disabled = true;
  scanButton.innerHTML = '<span class="button-icon">⏳</span><span>Analyzing...</span>';
  
  // Update status
  updateStatus('Fetching image...');
  
  // Show scanning overlay
  scanningOverlay.classList.remove('hidden');
  
  try {
    // Step 1: Fetch image as blob
    updateStatus('Converting image...');
    const imageBlob = await fetchImageAsBlob(currentImageUrl);
    
    // Step 2: Send to Proxy Server
    updateStatus('Analyzing with AI model...');
    const apiResponse = await analyzeImageWithProxy(imageBlob);
    
    // Step 3: Parse results
    updateStatus('Processing results...');
    const results = parseProxyResults(apiResponse);
    
    // Wait minimum 2 seconds for better UX (so users see the animation)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Hide scanning overlay
    scanningOverlay.classList.add('hidden');
    
    // Display results
    displayResults(results);
    
    // Update status
    updateStatus('Scan complete');
    
  } catch (error) {
    console.error('Scan error:', error);
    
    // Hide scanning overlay
    scanningOverlay.classList.add('hidden');
    
    // Display error
    displayError(error.message || 'An unexpected error occurred');
    
    // Update status
    updateStatus('Scan failed');
  } finally {
    // Re-enable button
    scanButton.disabled = false;
    scanButton.innerHTML = '<span class="button-icon">⚡</span><span>Rescan Image</span>';
  }
}

// Event Listeners
scanButton.addEventListener('click', performScan);

// Initialize
updateStatus('Ready');