# IdeasMiner

**Privacy-Focused Personal LLM Data Mining Platform**

IdeasMiner is a privacy-first web application that allows you to analyze your AI chat history from platforms like ChatGPT, Claude, and Gemini—entirely locally in your browser. All data processing happens on your device, ensuring complete privacy and cognitive sovereignty.

## 🌟 Features

- **Complete Privacy**: All data processing happens locally in your browser. Your conversations never leave your device.
- **Local Storage**: Uses IndexedDB to store your data securely in your browser. No external databases required.
- **Multi-Platform Support**: Import chat history from ChatGPT, Claude, Gemini, and other AI platforms.
- **Semantic Search**: Find conversations by meaning, not just keywords. Understand context and intent.
- **Idea Extraction**: Automatically identify and collect ideas, suggestions, and insights from your chats.
- **NLP Analysis**: Extract topics, analyze sentiment, and generate summaries using local processing.
- **Progressive Web App**: Install locally and use offline with full functionality.
- **Dark/Light Theme**: Toggle between themes for comfortable viewing.

## 🚀 Quick Start

### For Users

1. **Visit the Live Application** (once deployed)
2. **Import Your Data**: 
   - Export your chat history from ChatGPT, Claude, or other AI platforms
   - Upload the JSON file to IdeasMiner
3. **Explore Your Insights**:
   - Browse conversations
   - Search semantically
   - Extract and view ideas
   - Analyze patterns and trends

### For Developers

```bash
# Clone the repository
git clone https://github.com/MichealPreble/ideasminer.git
cd ideasminer

# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build
```

## 📦 Deployment

The application is a static site and can be deployed to any static hosting service:

### Option 1: Netlify Drop (Easiest - No Account Required)
1. Build the project: `pnpm build`
2. Go to https://app.netlify.com/drop
3. Drag and drop the `dist/public` folder
4. Get instant live URL

### Option 2: Cloudflare Pages (Free Forever)
1. Build the project: `pnpm build`
2. Go to https://dash.cloudflare.com/
3. Navigate to Pages → Create a project → Upload assets
4. Upload contents of `dist/public` folder
5. Your site will be live at: `https://ideasminer.pages.dev`

### Option 3: Vercel
```bash
npm i -g vercel
pnpm build
cd dist/public
vercel --prod
```

### Option 4: GitHub Pages
1. Enable GitHub Pages in repository settings
2. Set source to deploy from a branch or GitHub Actions
3. Deploy the `dist/public` folder

## 📊 How It Works

1. **Export Your Data**: Download your chat history from AI platforms as JSON files
2. **Import Locally**: Upload files to IdeasMiner—all processing happens in your browser
3. **Analyze & Discover**: Search conversations, extract ideas, view analytics, and gain insights

## 🔒 Privacy & Security

- **No Server-Side Processing**: All analysis happens in your browser using JavaScript and WebAssembly
- **No Data Transmission**: Your chat data never leaves your device
- **Local Storage Only**: Data is stored in your browser's IndexedDB
- **No Tracking**: No analytics, no cookies, no user tracking
- **Open Source**: Full transparency—inspect the code yourself

## 🛠️ Technology Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Database**: Dexie.js (IndexedDB wrapper)
- **NLP**: Compromise.js for natural language processing
- **Build**: Vite
- **Deployment**: Static hosting (Netlify, Cloudflare Pages, etc.)

## 📝 Supported Platforms

### ChatGPT
1. Go to ChatGPT Settings → Data Controls
2. Click "Export data"
3. Wait for email with data export
4. Download and extract `conversations.json`

### Claude
Check Claude's settings for data export options

### Other Platforms
Export your chat history as JSON and use the "Other" import option

## 🎯 Use Cases

- **Idea Mining**: Discover forgotten ideas and insights from your AI conversations
- **Knowledge Management**: Build a personal knowledge base from your AI interactions
- **Pattern Analysis**: Understand your usage patterns and topics of interest
- **Research**: Analyze conversation trends and sentiment over time
- **Privacy-Conscious Analysis**: Analyze sensitive conversations without cloud exposure

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🔗 Links

- **Repository**: https://github.com/MichealPreble/ideasminer
- **Issues**: https://github.com/MichealPreble/ideasminer/issues

## ⚡ Performance

The application is optimized for performance:
- Lazy loading of analysis modules
- Web Workers for heavy computations
- Efficient IndexedDB queries
- Minimal bundle size with code splitting

## 🌐 Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Any modern browser with IndexedDB support

---

**Built with privacy and cognitive sovereignty in mind.**

