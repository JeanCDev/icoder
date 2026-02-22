# CodeInterviewAssist

> ## ⚠️ IMPORTANT NOTICE TO THE COMMUNITY ⚠️
> 
> **This is a free, open-source initiative - NOT a full-service product!**
> 
> There are numerous paid interview preparation tools charging hundreds of dollars for comprehensive features like live audio capture, automated answer generation, and more. This project is fundamentally different:
> 
> - This is a **small, non-profit, community-driven project** with zero financial incentive behind it
> - The entire codebase is freely available for anyone to use, modify, or extend
> - Want features like voice support? You're welcome to integrate tools like OpenAI's Whisper or other APIs
> - New features should come through **community contributions** - it's unreasonable to expect a single maintainer to implement premium features for free
> - The maintainer receives no portfolio benefit, monetary compensation, or recognition for this work
> 
> **Before submitting feature requests or expecting personalized support, please understand this project exists purely as a community resource.** If you value what's been created, the best way to show appreciation is by contributing code, documentation, or helping other users.

> ## 🔑 API KEY INFORMATION - UPDATED
>
> We have tested and confirmed that **OpenAI, Gemini, and Anthropic (Claude) APIs work properly** with the current version. If you are experiencing issues with your API keys:
>
> - Try deleting your API key entry from the config file located in your user data directory
> - Log out and log back in to the application
> - Check your API key dashboard to verify the key is active and has sufficient credits
> - Ensure you're using the correct API key format (OpenAI keys start with "sk-", Anthropic keys start with "sk-ant-")
>
> The configuration file is stored at:
> - **Windows**: `C:\Users\[USERNAME]\AppData\Roaming\interview-coder-v1\config.json`
> - **macOS**: `/Users/[USERNAME]/Library/Application Support/interview-coder-v1/config.json`
> - **Linux**: `~/.config/interview-coder-v1/config.json`

## Free, Open-Source AI-Powered Interview Preparation Tool

This project provides a powerful alternative to premium coding interview platforms. It delivers the core functionality of paid interview preparation tools but in a free, open-source package. Using your own API key (OpenAI, Gemini, or Anthropic), you get access to advanced features like AI-powered problem analysis, solution generation, and debugging assistance - all running locally on your machine.

### Why This Exists

The best coding interview tools are often behind expensive paywalls, making them inaccessible to many students and job seekers. This project provides the same powerful functionality without the cost barrier, letting you:

- Use your own API key (pay only for what you use)
- Run everything locally on your machine with complete privacy
- Make customizations to suit your specific needs
- Learn from and contribute to an open-source tool

---

## 📋 Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
5. [Running the Application](#running-the-application)
6. [Global Commands](#global-commands)
7. [Configuration](#configuration)
8. [Project Architecture](#project-architecture)
9. [How It Works](#how-it-works)
10. [Building for Distribution](#building-for-distribution)
11. [Customization](#customization)
12. [Troubleshooting](#troubleshooting)
13. [Comparison with Paid Tools](#comparison-with-paid-interview-tools)
14. [License](#license)
15. [Disclaimer](#disclaimer-and-ethical-usage)

---

## Features

### Core Functionality

- 🎯 **99% Invisibility**: Undetectable window that bypasses most screen capture methods
- 💬 **Chat Interface**: Continuous conversation with AI, maintaining full context
- 📸 **Smart Screenshot Capture**: Attach multiple screenshots to your messages
- 🤖 **Multi-Provider AI Support**: Choose between OpenAI (GPT-4o), Google Gemini, or Anthropic Claude
- 💡 **Markdown Rendering**: Beautiful code formatting and syntax highlighting in responses
- 🔧 **Context-Aware Responses**: Full conversation history sent with each message
- 🎨 **Advanced Window Management**: Move, resize, adjust opacity, and zoom
- 🔒 **Privacy-Focused**: Your API key and data never leave your computer except for API calls
- 🌍 **Multi-Language Support**: Generate solutions in Python, JavaScript, Java, C++, and more

### Advanced Features

- **Click-Through Mode**: Make the window transparent to clicks, allowing interaction with windows behind it
- **Model Selection**: Choose different AI models for different tasks (extraction, solution, debugging)
- **Auto-Focus**: Automatically focuses the input field when click-through is disabled
- **Screenshot Management**: Individual removal or bulk clear of attached images
- **Keyboard Shortcuts**: Comprehensive global shortcuts that work even when the app is in the background

---

## Tech Stack

### Frontend
- **React 18.2.0**: UI library
- **TypeScript 5.4.2**: Programming language
- **Vite 6.2.5**: Build tool and dev server
- **Tailwind CSS 3.4.15**: CSS framework
- **Radix UI**: Accessible component primitives
- **React Query 5.64.0**: Async state management
- **React Markdown**: Markdown rendering with syntax highlighting
- **Lucide React**: Icon library

### Backend (Electron)
- **Electron 29.1.4**: Desktop framework
- **Node.js**: Runtime environment
- **OpenAI SDK 0.39.0**: GPT integration
- **Anthropic SDK**: Claude integration
- **Axios 1.7.7**: HTTP client for Gemini
- **screenshot-desktop 1.15.0**: Screen capture
- **electron-store 10.0.0**: Persistent storage
- **electron-updater 6.3.9**: Auto-update system

### Development Tools
- **ESLint**: Code linting
- **Electron Builder 24.13.3**: Application packaging
- **Concurrently**: Parallel script execution
- **Cross-env**: Cross-platform environment variables

---

## Prerequisites

1. **Node.js** (v16 or higher)
2. **npm** or **bun** package manager
3. **API Key** from one of:
   - OpenAI: https://platform.openai.com/api-keys
   - Google Gemini: https://aistudio.google.com/app/apikey
   - Anthropic: https://console.anthropic.com/settings/keys
4. **Screen Recording Permission**:
   - **macOS**: System Preferences > Security & Privacy > Privacy > Screen Recording
   - **Windows**: No additional permissions needed
   - **Linux**: May require `xhost` access depending on your distribution

---

## Installation

1. **Clone the repository**:
```bash
git clone https://github.com/greeneu/chattiq-opensource.git
cd chattiq-opensource
```

2. **Install dependencies**:
```bash
npm install
```

3. **Clean previous builds (recommended)**:
```bash
npm run clean
```

---

## Running the Application

### Development Mode

**Using npm:**
```bash
npm run dev
```

**Using stealth scripts:**

**Windows:**
```bash
stealth-run.bat
```

**macOS/Linux:**
```bash
chmod +x stealth-run.sh
./stealth-run.sh
```

**⚠️ IMPORTANT**: The application window will be invisible by default! Use `Ctrl+B` (or `Cmd+B` on Mac) to toggle visibility.

### Production Mode

```bash
# Build
npm run build

# Run
npm run run-prod
```

### Available Scripts

- `npm run clean` - Clean dist and dist-electron directories
- `npm run dev` - Start in development mode with hot reload
- `npm run build` - Create production build
- `npm run package` - Create installable package
- `npm run package-mac` - Create macOS package (DMG)
- `npm run package-win` - Create Windows installer (NSIS)

---

## Global Commands

All shortcuts work even when the application is in the background:

| Action | Windows/Linux | macOS |
|--------|---------------|-------|
| **Toggle Visibility** | `Ctrl+B` | `Cmd+B` |
| **Toggle Click-Through** | `Ctrl+.` | `Cmd+.` |
| **Take Screenshot** | `Ctrl+H` | `Cmd+H` |
| **Send Message** | `Enter` or `Ctrl+Enter` | `Enter` or `Cmd+Enter` |
| **New Line** | `Shift+Enter` | `Shift+Enter` |
| **Delete Last Screenshot** | `Ctrl+L` | `Cmd+L` |
| **Reset/Clear All** | `Ctrl+R` | `Cmd+R` |
| **Quit Application** | `Ctrl+Q` | `Cmd+Q` |
| **Move Window Left** | `Ctrl+←` | `Cmd+←` |
| **Move Window Right** | `Ctrl+→` | `Cmd+→` |
| **Move Window Up** | `Ctrl+↑` | `Cmd+↑` |
| **Move Window Down** | `Ctrl+↓` | `Cmd+↓` |
| **Decrease Opacity** | `Ctrl+[` | `Cmd+[` |
| **Increase Opacity** | `Ctrl+]` | `Cmd+]` |
| **Zoom Out** | `Ctrl+-` | `Cmd+-` |
| **Reset Zoom** | `Ctrl+0` | `Cmd+0` |
| **Zoom In** | `Ctrl+=` | `Cmd+=` |

---

## Configuration

### Settings Dialog

Access via the gear icon in the top bar. Configure:

1. **API Provider Selection**
   - OpenAI (GPT-4o models)
   - Google Gemini (Gemini 1.5/2.5 models)
   - Anthropic (Claude 3 models)

2. **API Key**
   - Stored locally and encrypted
   - Never sent anywhere except to your chosen AI provider
   - Masked display for security

3. **Model Selection by Stage**
   - **Problem Extraction**: Model used to analyze screenshots
   - **Solution Generation**: Model used to generate code solutions
   - **Debugging**: Model used to debug and improve code

4. **Programming Language**
   - Choose your preferred language for code generation
   - Supports: Python, JavaScript, TypeScript, Java, C++, C#, Go, Rust, Ruby, PHP, Swift, Kotlin

5. **Keyboard Shortcuts Reference**
   - Complete list of all available shortcuts
   - Quick access to common actions

### Configuration Storage

Settings are stored locally at:
- **Windows**: `C:\Users\[USERNAME]\AppData\Roaming\chattiq-v1\config.json`
- **macOS**: `/Users/[USERNAME]/Library/Application Support/chattiq-v1/config.json`
- **Linux**: `~/.config/chattiq-v1/config.json`

---

## Project Architecture

### Directory Structure

```
chattiq-v1/
├── electron/                    # Electron main process code
│   ├── main.ts                 # Main entry point
│   ├── preload.ts              # IPC bridge
│   ├── ProcessingHelper.ts     # AI processing logic
│   ├── ScreenshotHelper.ts     # Screenshot management
│   ├── shortcuts.ts            # Global keyboard shortcuts
│   ├── ConfigHelper.ts         # Configuration management
│   ├── ipcHandlers.ts          # IPC communication handlers
│   ├── autoUpdater.ts          # Auto-update system
│   └── store.ts                # Persistent storage
│
├── src/                        # React renderer process code
│   ├── components/             # React components
│   │   ├── Queue/             # Screenshot queue and chat
│   │   ├── Settings/          # Settings dialog
│   │   ├── shared/            # Shared components
│   │   └── ui/                # UI primitives
│   ├── contexts/              # React contexts
│   ├── types/                 # TypeScript definitions
│   ├── utils/                 # Utility functions
│   └── _pages/                # Page components
│
├── assets/                     # Application assets
│   └── icons/                 # Platform-specific icons
│
├── build/                      # Electron build files
├── dist/                       # React production build
├── dist-electron/              # Electron production build
└── release/                    # Distributable packages
```

### Communication Architecture

```
┌─────────────────────┐         IPC          ┌──────────────────────┐
│  Renderer Process   │ ◄──────────────────► │    Main Process      │
│   (React/Browser)   │                      │  (Node.js/Electron)  │
└─────────────────────┘                      └──────────────────────┘
         │                                              │
         │                                              │
         ▼                                              ▼
  ┌──────────────┐                            ┌─────────────────┐
  │  Components  │                            │    Helpers      │
  │    React     │                            │  - Processing   │
  │              │                            │  - Screenshot   │
  └──────────────┘                            │  - Shortcuts    │
                                              └─────────────────┘
```

---

## How It Works

### 1. Initial Setup
- Launch the application (window is invisible by default)
- Press `Ctrl+B` / `Cmd+B` to make it visible
- Click the gear icon to open settings
- Select your AI provider and enter your API key
- Choose your preferred models and programming language

### 2. Chat Interface
- Type your questions or coding problems in the text area
- Attach screenshots using `Ctrl+H` / `Cmd+H`
- Send messages with `Enter` or `Ctrl+Enter`
- View AI responses with beautiful markdown formatting
- Full conversation history is maintained for context

### 3. Screenshot Management
- Take screenshots with `Ctrl+H` / `Cmd+H`
- Screenshots appear as thumbnails above the input
- Remove individual screenshots with the × button
- Clear all screenshots with "Clear all" button
- Delete last screenshot with `Ctrl+L` / `Cmd+L`

### 4. Click-Through Mode
- Enable with `Ctrl+.` / `Cmd+.` or the toggle button
- When enabled: clicks pass through the window
- When disabled: window functions normally
- Visual indicator: green dot (enabled) / gray dot (disabled)
- Automatically focuses input field when disabled

### 5. Window Management
- Move window: `Ctrl+Arrow` / `Cmd+Arrow`
- Toggle visibility: `Ctrl+B` / `Cmd+B`
- Adjust opacity: `Ctrl+[` and `Ctrl+]` / `Cmd+[` and `Cmd+]`
- Zoom: `Ctrl+-/0/=` / `Cmd+-/0/=`
- Window remains invisible to most screen capture methods

### 6. AI Processing Flow

**Message with Context:**
```typescript
// 1. User types message and attaches screenshots
const payload = {
  message: "How do I solve this problem?",
  history: conversationHistory,  // Full chat history
  screenshots: [screenshot1, screenshot2]
}

// 2. Backend processes with chosen AI provider
// - Loads screenshots as base64
// - Builds message with full context
// - Sends to API (OpenAI/Gemini/Claude)
// - Returns formatted markdown response

// 3. Frontend renders response
// - Markdown with syntax highlighting
// - Code blocks with language detection
// - Maintains conversation flow
```

---

## Building for Distribution

### macOS (DMG)

```bash
npm run package-mac
```

Generates:
- `Chattiq-x64.dmg`
- `Chattiq-arm64.dmg`
- `Chattiq-x64.zip`
- `Chattiq-arm64.zip`

### Windows (Installer)

```bash
npm run package-win
```

Generates:
- `Chattiq-Windows-1.0.19.exe`
- `Chattiq-Windows-1.0.19.exe.blockmap`
- `latest.yml` (for auto-updates)

### Linux (AppImage)

```bash
npm run package
# or
electron-builder --linux
```

Generates:
- `Chattiq-Linux-1.0.19.AppImage`

### Build Process

1. **Clean**: `npm run clean`
2. **Frontend Build**: Vite builds React app to `dist/`
3. **Backend Build**: TypeScript compiles to `dist-electron/`
4. **Package**: Electron Builder creates installers in `release/`

---

## Customization

### Adding New AI Models

The application is designed for easy extensibility. To add new AI providers:

1. **Update ProcessingHelper.ts**:
```typescript
// Add new provider integration
async generateChatReplyWithContext(message, history, screenshots) {
  const config = configHelper.loadConfig();
  
  if (config.apiProvider === 'your-provider') {
    // Your provider implementation
  }
}
```

2. **Update SettingsDialog.tsx**:
```typescript
// Add provider option
const modelCategories: ModelCategory[] = [
  {
    key: 'extractionModel',
    yourProviderModels: [
      { id: "model-id", name: "Model Name", description: "..." }
    ]
  }
];
```

3. **Update ConfigHelper.ts**:
```typescript
// Add provider type
type APIProvider = "openai" | "gemini" | "anthropic" | "your-provider";
```

### Adding New Languages

Edit `src/components/shared/LanguageSelector.tsx`:

```typescript
const languages = [
  "python",
  "javascript",
  // Add your language here
  "kotlin",
  "scala"
];
```

### Customizing UI

- **Colors**: Edit `tailwind.config.js`
- **Components**: Modify files in `src/components/`
- **Styles**: Update `src/index.css`

---

## Troubleshooting

### Common Issues

#### 1. Window Doesn't Appear
- Press `Ctrl+B` / `Cmd+B` multiple times
- Increase opacity with `Ctrl+]` / `Cmd+]`
- Move window with `Ctrl+Arrow` keys (might be off-screen)

#### 2. API Key Invalid
- Verify key format (OpenAI: "sk-", Anthropic: "sk-ant-")
- Check key has sufficient credits
- Delete config file and reconfigure:
  - Windows: `%APPDATA%\chattiq-v1\config.json`
  - macOS: `~/Library/Application Support/chattiq-v1/config.json`

#### 3. Screenshots Not Working
- **macOS**: Grant screen recording permission
- **Windows**: Run as administrator if needed
- Check disk space
- Restart application

#### 4. Development Server Won't Start
```bash
npm run clean
rm -rf node_modules package-lock.json
npm install
npm run dev
```

#### 5. Build Fails
```bash
# Check Node.js version
node --version  # Should be v16+

# Clean and rebuild
npm cache clean --force
npm install
npm run clean
npm run build
```

### Logs and Debugging

**Enable DevTools** (development mode):
```typescript
// electron/main.ts
mainWindow.webContents.openDevTools();
```

**Log Locations**:
- Windows: `%APPDATA%\chattiq-v1\logs\`
- macOS: `~/Library/Logs/chattiq-v1/`
- Linux: `~/.config/chattiq-v1/logs/`

### Compatibility

**Invisibility Works With**:
- ✅ Zoom versions below 6.1.6
- ✅ Discord (all versions)
- ✅ Browser-based screen recording
- ✅ macOS screenshot (Cmd+Shift+3/4)

**Invisibility Does NOT Work With**:
- ❌ Zoom 6.1.6 and above ([downgrade link](https://zoom.en.uptodown.com/mac/versions))
- ❌ macOS screen recording (Cmd+Shift+5)

---

## Comparison with Paid Interview Tools

| Feature | Premium Tools | CodeInterviewAssist |
|---------|---------------|---------------------|
| **Price** | $60+/month | Free (API costs only) |
| **Solution Generation** | ✅ | ✅ |
| **Chat Interface** | ✅ | ✅ |
| **Context Awareness** | ✅ | ✅ |
| **Debugging Assistance** | ✅ | ✅ |
| **Invisibility** | ✅ | ✅ |
| **Multi-Language Support** | ✅ | ✅ |
| **Multiple AI Providers** | ❌ | ✅ (OpenAI, Gemini, Claude) |
| **Click-Through Mode** | ❌ | ✅ |
| **Window Management** | ✅ | ✅ |
| **Privacy** | Server-processed | 100% Local |
| **Customization** | Limited | Full Source Access |
| **Model Selection** | Limited | Per-stage selection |
| **Open Source** | ❌ | ✅ |

---

## Invisibility Compatibility

The application is invisible to:
- Zoom versions below 6.1.6 (inclusive)
- All browser-based screen recording software
- All versions of Discord
- macOS screenshot functionality (Command + Shift + 3/4)

**Note**: The application is **NOT** invisible to:
- Zoom versions 6.1.6 and above
  - [Downgrade Zoom if needed](https://zoom.en.uptodown.com/mac/versions)
- macOS native screen recording (Command + Shift + 5)

---

## License

This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0).

### What This Means

- ✅ Free to use, modify, and distribute
- ✅ Must share modifications under the same license
- ✅ Must make source code available if running on a network server
- ✅ We encourage contributing improvements back to the project

See [LICENSE-SHORT](LICENSE-SHORT) for a summary or visit [GNU AGPL-3.0](https://www.gnu.org/licenses/agpl-3.0.html) for full terms.

### Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## Disclaimer and Ethical Usage

This tool is intended as a learning aid and practice assistant. Consider these ethical guidelines:

- **Be honest** about using assistance tools if asked directly in an interview
- **Use to learn** concepts, not just to get answers
- **Understand solutions** rather than simply presenting them
- **In take-home assignments**, ensure you thoroughly understand any solutions you submit

Remember: Technical interviews assess your problem-solving skills and understanding. This tool works best when used to enhance your learning, not as a substitute for it.

---

## Support and Questions

- **Issues**: Open an issue on [GitHub](https://github.com/greeneu/chattiq-opensource/issues)
- **Discussions**: Use GitHub Discussions for questions
- **Contributing**: See [CONTRIBUTING.md](CONTRIBUTING.md)

---

## Project Information

- **Name**: chattiq-v1
- **Version**: 1.0.19
- **License**: AGPL-3.0-or-later
- **Author**: Chattiq Contributors
- **Repository**: https://github.com/greeneu/chattiq-opensource

---

> **Remember:** This is a community resource. If you find it valuable, consider contributing rather than just requesting features. The project grows through collective effort, not individual demands.

---

## Additional Resources

### API Documentation
- **OpenAI**: https://platform.openai.com/docs
- **Google Gemini**: https://ai.google.dev/docs
- **Anthropic Claude**: https://docs.anthropic.com

### Get API Keys
- **OpenAI**: https://platform.openai.com/api-keys
- **Google Gemini**: https://aistudio.google.com/app/apikey
- **Anthropic**: https://console.anthropic.com/settings/keys

### Community
- **GitHub Issues**: Report bugs and request features
- **Contributions**: Help improve the project
- **Documentation**: Help others by improving docs

---

**Last Updated**: 2024  
**Maintained by**: Chattiq Contributors
