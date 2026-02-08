# TraceableAI - Deepfake Detection Chrome Extension

A Chrome Extension (Manifest V3) that audits deepfakes on X.com using real AI detection powered by Hugging Face's `Ateeqq/ai-vs-human-image-detector` model.

## Features

- 🔍 **One-Click Scanning**: Inject "Scan for Deepfake" buttons directly onto X.com tweets
- 🤖 **Real AI Detection**: Uses Hugging Face's AI vs Human image detection model
- 🎨 **Cyber-Industrial UI**: Dark theme with neon blue accents and scanning laser animation
- 📊 **Trust Score Analysis**: Get real confidence scores from the AI model
- 🎯 **Smart Color Coding**: Red for AI-generated, Green for human-made images
- ⚡ **Side Panel Interface**: Non-intrusive scanning experience in Chrome's side panel

## Installation

### 1. Get Your Hugging Face API Key

1. Go to [Hugging Face](https://huggingface.co/) and create a free account (if you don't have one)
2. Navigate to your [Access Tokens page](https://huggingface.co/settings/tokens)
3. Click "New token" and create a token with "Read" permissions
4. Copy the token (you'll need it in step 3)

### 2. Download the Extension Files

Ensure all files are in the same directory:
- `manifest.json`
- `background.js`
- `content.js`
- `sidepanel.html`
- `sidepanel.js`
- `sidepanel.css`

### 3. Add Your API Key

1. Open `sidepanel.js` in a text editor
2. Find line 7: `const HUGGINGFACE_API_KEY = "YOUR_HUGGING_FACE_TOKEN_HERE";`
3. Replace `YOUR_HUGGING_FACE_TOKEN_HERE` with your actual Hugging Face token
4. Save the file

Example:
```javascript
const HUGGINGFACE_API_KEY = "hf_abcdefghijklmnopqrstuvwxyz123456789";
```

### 4. Create Icon Files (Optional)

- Create an `icons` folder
- Add icon files: `icon16.png`, `icon48.png`, `icon128.png`
- Or remove the icons section from `manifest.json` temporarily

### 5. Load the Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right corner)
3. Click "Load unpacked"
4. Select the folder containing your extension files
5. The extension should now appear in your extensions list

## Usage

1. **Navigate to X.com** (formerly Twitter)
   - Visit https://x.com or https://twitter.com

2. **Find tweets with images**
   - Scroll through your feed to find tweets containing images

3. **Click "Scan for Deepfake" button**
   - A cyan button will appear on tweets with media
   - Click the button to scan the image

4. **View real AI detection results**
   - The side panel will automatically open
   - Watch the scanning laser animation
   - Get real results from the Hugging Face model:
     - **Trust Score**: Calculated based on AI confidence
     - **Verdict**: Either "LIKELY AI-GENERATED" (Red) or "LIKELY AUTHENTIC" (Green)
     - **Confidence**: The model's confidence percentage
     - **Model Predictions**: Breakdown of "Artificial" vs "Human" scores

## How It Works

### API Integration

The extension uses the Hugging Face Inference API with the following flow:

1. **Image Fetching**: Converts the Twitter image URL to a Blob
2. **Size Validation**: Checks that the image is under 10MB
3. **API Request**: Sends the image blob to `Ateeqq/ai-vs-human-image-detector`
4. **Response Parsing**: Processes the model's predictions
5. **Result Display**: Shows color-coded results with confidence scores

### Model Response Format

The Hugging Face model returns predictions like:
```json
[
  { "label": "artificial", "score": 0.8234 },
  { "label": "human", "score": 0.1766 }
]
```

The extension:
- Takes the highest confidence prediction
- **If "artificial"**: Shows Red color, low trust score
- **If "human"**: Shows Green color, high trust score

### Trust Score Calculation

- **AI-Generated Images**: Trust Score = 100 - Confidence (max 95)
- **Human-Made Images**: Trust Score = Confidence

## Error Handling

The extension handles common errors:

- ❌ **API Key Missing**: Prompts you to set your token
- ❌ **Model Loading**: Waits 20-30 seconds for the model to load
- ❌ **Invalid API Key**: Checks authentication
- ❌ **Rate Limits**: Notifies when too many requests are made
- ❌ **Image Too Large**: Validates images are under 10MB
- ❌ **Network Errors**: Catches and displays fetch failures

## File Structure

```
TraceableAI/
├── manifest.json          # Extension configuration
├── background.js          # Service worker for handling messages
├── content.js             # Injects buttons into X.com pages
├── sidepanel.html         # Side panel UI structure
├── sidepanel.js           # 🔥 REAL AI detection with Hugging Face API
├── sidepanel.css          # Cyber-industrial styling + new prediction bars
├── icons/                 # Extension icons (optional)
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md              # This file
```

## Key Updates (Day 4)

### What Changed from the Simulated Version:

1. ✅ **Real API Integration**: Replaced random scores with actual Hugging Face API calls
2. ✅ **Image Blob Conversion**: Fetches and converts Twitter images to blobs
3. ✅ **Authorization Headers**: Implements Bearer token authentication
4. ✅ **Dynamic Color Coding**: 
   - Red (`#ff4444`) for AI-generated images
   - Green (`#00ff88`) for human-made images
5. ✅ **Prediction Breakdown**: Shows both "Artificial" and "Human" scores with bars
6. ✅ **Error Handling**: Comprehensive error messages with suggestions
7. ✅ **Status Updates**: Real-time status during fetch → convert → analyze flow

## Technical Details

- **Manifest Version**: V3
- **Permissions**: `sidePanel`, `storage`, `activeTab`
- **Host Permissions**: `https://x.com/*`, `https://twitter.com/*`
- **API Endpoint**: `https://api-inference.huggingface.co/models/Ateeqq/ai-vs-human-image-detector`
- **Model**: [Ateeqq/ai-vs-human-image-detector](https://huggingface.co/Ateeqq/ai-vs-human-image-detector)
- **Max Image Size**: 10MB
- **Response Format**: JSON array with label + score predictions

## Troubleshooting

### "Please set your Hugging Face API key"
- Open `sidepanel.js` and replace `YOUR_HUGGING_FACE_TOKEN_HERE` with your token
- Make sure there are no extra spaces or quotes

### "Model is currently loading"
- The Hugging Face model needs 20-30 seconds to warm up
- Wait and try scanning again
- This is normal for the first request

### "Invalid API key"
- Double-check your token from https://huggingface.co/settings/tokens
- Ensure you copied the entire token
- Create a new token if needed

### "Image too large"
- Twitter images are usually fine, but some high-res images exceed 10MB
- The extension will show the exact size in the error message

### "Rate limit exceeded"
- Hugging Face free tier has rate limits
- Wait a few minutes before scanning again
- Consider upgrading your Hugging Face account for higher limits

### Side panel doesn't open
- Check that you've clicked the scan button on a tweet with an image
- Verify the extension has the necessary permissions
- Try reloading the extension

### Buttons don't appear on tweets
- Refresh the X.com page after installing
- Check browser console for any errors
- Ensure content script permissions are granted

## API Rate Limits

Hugging Face free tier limitations:
- **Requests**: Limited per hour
- **Model Loading**: First request may take 20-30 seconds
- **Image Size**: Maximum 10MB per image

For production use, consider:
- Upgrading to Hugging Face Pro
- Implementing request caching
- Adding request queuing

## Privacy & Security

- ✅ Images are sent directly to Hugging Face (not stored on our servers)
- ✅ Your API key is stored locally in the extension
- ✅ No user data is collected or tracked
- ✅ All processing happens client-side in your browser

## Future Enhancements

Potential improvements:
- [ ] Multiple model support
- [ ] Batch scanning
- [ ] Scan history
- [ ] Export results
- [ ] Custom trust score thresholds
- [ ] Browser notifications

## Credits

- **Model**: [Ateeqq/ai-vs-human-image-detector](https://huggingface.co/Ateeqq/ai-vs-human-image-detector)
- **API**: [Hugging Face Inference API](https://huggingface.co/docs/api-inference)
- **Platform**: Chrome Extensions Manifest V3

## License

MIT License - Feel free to modify and distribute as needed.

## Version

v2.0.0 (Day 4 - Real AI Detection Enabled!)