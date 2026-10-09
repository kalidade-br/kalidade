# J2ME Player

<div align="center">

[![License](https://img.shields.io/badge/license-GPL--3.0-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Powered by CheerpJ](https://img.shields.io/badge/powered%20by-CheerpJ-orange.svg)](https://cheerpj.com/)

**🎮 Play classic J2ME mobile games directly in your browser! 🎮**

*Relive the golden age of mobile gaming - no installation required*

[🚀 Live Demo](#-demo) • [📖 Documentation](#-quick-start) • [🤝 Contributing](#-contributing) • [💬 Support](#-support)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Demo](#-demo)
- [Quick Start](#-quick-start)
- [Keyboard Controls](#️-keyboard-controls)
- [Troubleshooting](#-troubleshooting)
- [Technical Architecture](#️-technical-architecture)
- [Building from Source](#️-building-from-source)
- [Deployment](#-deployment)
- [About CheerpJ](#-about-cheerpj)
- [Embedding Games](#-embedding-games)
- [Contributing](#-contributing)
- [License](#-license)
- [Credits](#-credits--acknowledgments)

---

## 📖 About

J2ME Player is a web-based Java ME (J2ME) emulator that brings nostalgic mobile games from the 2000s era back to life. Built with modern web technologies, it runs entirely in your browser with no installation required.

> **🔄 Fork Notice:** This project is a fork of [zb3/freej2me-web](https://github.com/zb3/freej2me-web), with additional features and improvements focused on user experience, branding, and modern web standards.

## ✨ Features

- 🎮 **Browser-Based Emulation** - Play J2ME games without any downloads or installations
- 🔒 **Sandboxed Security** - Safe to load any JAR file thanks to web platform isolation
- 📱 **Multiple Phone Types** - Support for Nokia, Motorola, Siemens, and SonyEricsson
- ⚙️ **Configurable Settings** - Customize screen size, phone type, audio, and more
- 🎵 **Audio Support** - MIDI playback via WebAssembly-compiled FluidSynth
- 🎨 **3D Graphics** - WebGL 2 support for M3G and Mascot Capsule v3
- 📦 **Import/Export** - Save and transfer your game data across devices
- 💾 **Progressive Web App** - Install as a standalone app on your device
- 📴 **Offline Cache** - Play your installed games without internet (optional)

## 🚀 Demo

Try it now: **[https://j2me-player.netlify.app/](https://j2me-player.netlify.app/)**


## 🎯 Quick Start

1. **Upload a Game**: Click "Select JAR file" and choose a J2ME game file
2. **Configure Settings**: Adjust screen size, phone type, and other options as needed
3. **Play**: Click "Add game" and start playing!

### 📱 Touch Controls

On mobile devices, virtual keypad buttons are displayed for full game control.

### ⌨️ Keyboard Controls

| **Key** | **Functions As** |
| :------------: | :--------------: |
| <kbd>Esc</kbd> | Enter/exit menu options |
| <kbd>F1</kbd> or <kbd>Q</kbd> | Left soft key |
| <kbd>F2</kbd> or <kbd>W</kbd> | Right soft key |
| <kbd>0</kbd> to <kbd>9</kbd> | Keypad Numbers |
| Numpad keys | Numbers with keys 123 and 789 swapped |
| <kbd>E</kbd> | * |
| <kbd>R</kbd> | # |
| <kbd>↑</kbd> <kbd>↓</kbd> <kbd>←</kbd> <kbd>→</kbd> | D-Pad navigation |
| <kbd>⏎ Enter</kbd> | Action key (OK button) |

> **💡 Tip:** Phone types (Nokia, Motorola, etc.) have different key mappings. By default, Nokia mapping is used, but you can change this in settings. In "Standard" mode, arrow keys map to 2, 4, 6, 8 and Enter maps to 5.

## 🔧 Troubleshooting

### Game not working?

If a game doesn't work properly, try these steps:

1. **Press <kbd>Esc</kbd>** to open the settings menu
2. **Try different configurations**:
   - Change display size (try different resolutions)
   - Toggle compatibility flags
   - Disable sound
   - Switch phone type (Nokia, Motorola, etc.)
3. **Check browser console** (F12) for error messages
4. **Restart the game** after changing settings

> **⚠️ Note:** Not every J2ME game will work perfectly with this emulator. If you encounter persistent issues, please [open an issue](../../issues) with details about the game and error messages.


## 🏗️ Technical Architecture

J2ME Player leverages modern web technologies to bring J2ME games to the browser:

### Core Components

- **Java Runtime**: Powered by [CheerpJ](https://cheerpj.com/) for running Java bytecode in the browser
- **FreeJ2ME Core**: Based on the excellent [FreeJ2ME](https://github.com/hex007/freej2me) emulator

### Graphics & Rendering

- **2D Graphics**: Custom JavaScript implementation using Canvas 2D (faster than CheerpJ AWT)
- **3D Support**:
  - WebGL 2-based implementation
  - M3G from KEmulator (rewritten for OpenGL ES 2)
  - Mascot Capsule v3 support (optimized from JL-Mod)

### Audio System

- **MIDI Playback** (`libmidi`):
  - Modified FluidSynth compiled to WebAssembly
  - WebAudio API + AudioWorkletNode for low-latency playback

- **Media Playback** (`libmedia`):
  - FFmpeg compiled to WebAssembly
  - Decodes various audio formats (AMR, etc.)
  - HTML5 `<video>` element for playback

### Progressive Web App

- Service Worker for offline caching
- Web App Manifest for installability
- LocalStorage for persistent data

## 🛠️ Building from Source

### Prerequisites

- Docker installed on your system
- Linux host (or WSL2 on Windows)
- Git

### Build Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/iqbaladinur/j2me-player.git
   cd j2me-player
   ```

2. **Build the Docker image**:
   ```bash
   docker build --build-arg UID=$(id -u) -t freej2me-web-builder builder_image
   ```

3. **Build the JAR file**:
   ```bash
   docker run --rm -it -uzb3 -w /app -v`pwd`:/app freej2me-web-builder ant
   ```

4. **(Optional) Rebuild WebAssembly modules**:
   ```bash
   # Build libmedia
   docker run --rm -it -uzb3 -w /app -v`pwd`:/app freej2me-web-builder web/libmedia/transcode/wasm/build.sh --release

   # Build libmidi
   docker run --rm -it -uzb3 -w /app -v`pwd`:/app freej2me-web-builder web/libmidi/wasm/build.sh --release
   ```

### Local Development

To serve the application locally:

```bash
npx serve -u web
```

> **📝 Note:** CheerpJ requires proper handling of the `Range` header. The `serve` command above is configured to handle this correctly.

Then open your browser to `http://localhost:3000` (or the port shown in terminal).

## 🌐 Deployment

### Quick Deploy to Cloudflare Pages

**Recommended platform** for best performance and compatibility.

1. **Push to Git repository** (GitHub/GitLab/Bitbucket)
2. **Connect to Cloudflare Pages**:
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → Pages
   - Click **Connect to Git**
   - Select your repository
   - Set **Build output directory**: `web`
   - Deploy!

3. **If you get Range header error**:
   ```bash
   # Trigger redeploy
   git commit --allow-empty -m "Trigger redeploy"
   git push
   ```
   - Wait 1-2 minutes for CDN propagation
   - Hard refresh browser (Ctrl+Shift+R)

> **📚 Full deployment guide:** See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions, other platforms (Netlify, Vercel, self-hosted), and troubleshooting.

## 📡 About CheerpJ

J2ME Player uses [CheerpJ](https://cheerpj.com/) to run Java in the browser. While CheerpJ is proprietary, we use it minimally:

- ✅ No AWT GUI support
- ✅ No wasm JNI modules
- ✅ Basic Java bytecode execution only

**Limitations:**
- Requires internet connection for CheerpJ runtime (unless cached)
- May have performance overhead compared to native execution

> **🔮 Future:** If CheerpJ becomes unavailable, the project could theoretically be ported to an alternative JVM (though this is not currently planned).

## 🔗 Embedding Games

You can embed specific games on your website. Here's how:

### Prerequisites

1. Self-host J2ME Player (ensure your server supports the `Range` header)
2. Prepare the game package with proper configuration

### Preparation Steps

1. **Install the game** in the launcher
2. **Configure settings** (screen size, phone type, etc.)
3. **Export data** using the "Export Data" button
4. **Find the App ID** by launching the game and checking the `app` parameter in the URL
5. **Extract game folder** from the exported `.zip` file (folder named after App ID)
6. **Create game package**: Zip the App ID folder contents into `[app_id].zip`
7. **Deploy**: Place `[app_id].zip` in the `apps` folder (same directory as `run.html`)

### Embedding

```html
<!-- Basic embed -->
<iframe src="run.html?app=[app_id]" width="240" height="320"></iframe>

<!-- With fractional scaling -->
<iframe src="run.html?app=[app_id]&fractionScale=1" width="480" height="640"></iframe>
```

> **💡 Tip:** Match iframe dimensions to the game's screen size (or a multiple). Use `fractionScale` parameter for aspect-ratio-only matching.

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Ways to Contribute

- 🐛 **Report bugs** - Open an issue with details and steps to reproduce
- 💡 **Suggest features** - Share your ideas for improvements
- 📝 **Improve documentation** - Help make the docs clearer
- 🔧 **Submit pull requests** - Fix bugs or add features
- 🎮 **Test games** - Report compatibility issues

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

Please ensure your PR:
- Follows the existing code style
- Includes relevant tests if applicable
- Updates documentation as needed
- Has a clear description of changes

## 📜 License

This project is licensed under the **GNU General Public License v3.0** - see the [LICENSE](LICENSE) file for details.

### Third-Party Licenses

This project uses several open-source components:

- **FreeJ2ME** - GPL-3.0 License
- **FluidSynth** (libmidi) - LGPL-2.1 License
- **FFmpeg** (libmedia) - LGPL-2.1/GPL-2.0 License (depending on configuration)
- **CheerpJ** - Proprietary (Leaningtech Limited)

## 🙏 Credits & Acknowledgments

J2ME Player stands on the shoulders of giants. Special thanks to:

### Original Projects

- **[zb3/freej2me-web](https://github.com/zb3/freej2me-web)** - The original fork this project is based on
- **[FreeJ2ME](https://github.com/hex007/freej2me)** by hex007 - The core J2ME emulator
- **[KEmulator](https://github.com/kelomaniack/KEmulator)** - M3G implementation
- **[JL-Mod](https://github.com/woesss/JL-Mod)** - Mascot Capsule v3 support

### Technologies

- **[CheerpJ](https://cheerpj.com/)** by Leaningtech - Java-to-WebAssembly compiler
- **[FluidSynth](https://www.fluidsynth.org/)** - MIDI synthesis
- **[FFmpeg](https://ffmpeg.org/)** - Media decoding

### Community

- All contributors who have helped improve this project
- Game developers from [schwandtner.info/midlets](https://www.schwandtner.info/midlets/) for included sample games
- The J2ME preservation community

### Maintainer

This fork is maintained with ❤️ by the community.

---

## 📞 Support

- 🐛 **Bug Reports**: [Open an issue](../../issues)
- 💬 **Discussions**: [GitHub Discussions](../../discussions)
- 📧 **Contact**: Create an issue for questions

---

<div align="center">

**[⬆ Back to Top](#j2me-player)**

Made with ☕ and nostalgia for the golden age of mobile gaming

</div>
