# TraceableAI - Deepfake Detection Chrome Extension

A Chrome Extension (Manifest V3) that audits deepfakes on X.com with a sleek cyber-industrial interface.

## Features

- 🔍 **One-Click Scanning**: Inject "Scan for Deepfake" buttons directly onto X.com tweets
- 🎨 **Cyber-Industrial UI**: Dark theme with neon blue accents and scanning laser animation
- 📊 **Trust Score Analysis**: Generate detailed trust scores with confidence levels
- 🎯 **Artifact Detection**: Identify potential manipulation artifacts in images
- ⚡ **Side Panel Interface**: Non-intrusive scanning experience in Chrome's side panel

## Installation

1. **Download the extension files**
   - Ensure all files are in the same directory:
     - `manifest.json`
     - `background.js`
     - `content.js`
     - `sidepanel.html`
     - `sidepanel.js`
     - `sidepanel.css`

2. **Create icon files** (optional but recommended)
   - Create an `icons` folder
   - Add icon files: `icon16.png`, `icon48.png`, `icon128.png`
   - Or remove the icons section from `manifest.json` temporarily

3. **Load the extension in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right corner)
   - Click "Load unpacked"
   - Select the folder containing your extension files
   - The extension should now appear in your extensions list

## Usage

1. **Navigate to X.com** (formerly Twitter)
   - Visit https://x.com or https://twitter.com

2. **Find tweets with images**
   - Scroll through your feed to find tweets containing images

3. **Click "Scan for Deepfake" button**
   - A cyan button will appear on tweets with media
   - Click the button to scan the image

4. **View results in side panel**
   - The side panel will automatically open
   - Watch the scanning laser animation (3 seconds)
   - Review the trust score, verdict, and detected artifacts

## File Structure

```
TraceableAI/
├── manifest.json          # Extension configuration
├── background.js          # Service worker for handling messages
├── content.js             # Injects buttons into X.com pages
├── sidepanel.html         # Side panel UI structure
├── sidepanel.js           # Side panel logic and scanning
├── sidepanel.css          # Cyber-industrial styling
├── icons/                 # Extension icons (optional)
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md              # This file
```

## Key Features Explained

### Scanning Animation
- 3-second scanning laser that sweeps vertically across the image
- Neon blue glow effect with cyber aesthetic
- "ANALYZING..." text with pulsing animation

### Trust Score System
- Generates random trust scores (1-100)
- **70-100**: AUTHENTIC (green)
- **40-69**: SUSPICIOUS (yellow)
- **1-39**: LIKELY MANIPULATED (red)

### Artifact Detection
- Detects multiple potential manipulation types:
  - Facial Asymmetry
  - Lighting Inconsistencies
  - Compression Artifacts
  - Pixel Anomalies
- Each artifact includes severity level (Low/Medium/High)

### Cyber-Industrial Theme
- Dark gray background (#0a0e14)
- Neon blue accents (#00d4ff)
- Glowing effects and shadows
- Industrial typography with letter-spacing

## Technical Details

- **Manifest Version**: V3
- **Permissions**: `sidePanel`, `storage`, `activeTab`
- **Host Permissions**: `https://x.com/*`, `https://twitter.com/*`
- **Content Script**: Runs on X.com to inject scan buttons
- **Storage**: Uses `chrome.storage.local` for passing image URLs
- **Service Worker**: Handles message passing and side panel opening

## Note

This is a **demonstration/prototype** extension. The "scanning" is simulated with random results for educational purposes. A production version would require:
- Integration with actual deepfake detection APIs
- Machine learning models for image analysis
- Backend processing infrastructure
- User authentication and data privacy measures

## Troubleshooting

**Side panel doesn't open:**
- Check that you've clicked the scan button on a tweet with an image
- Verify the extension has the necessary permissions
- Try reloading the extension

**Buttons don't appear on tweets:**
- Refresh the X.com page after installing
- Check browser console for any errors
- Ensure content script permissions are granted

**Scanning animation doesn't show:**
- Clear browser cache
- Check that `sidepanel.css` is properly loaded
- Verify no CSS conflicts with browser extensions

## License

MIT License - Feel free to modify and distribute as needed.

## Version

v1.0.0