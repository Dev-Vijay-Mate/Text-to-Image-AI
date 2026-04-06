# AI Image Generator

A stark, high-contrast text-to-image generation interface. Designed with a strict **Bold Typography / Editorial Design System**, focusing on massive typography and zero-fluff aesthetics.

## Features

- **Text-to-Image Generation**: Directly query the Hugging Face Inference API (`stabilityai/stable-diffusion-xl-base-1.0`) from the browser.
- **Bold Typography Aesthetics**: No shadows, no rounded corners (0px `border-radius`), no gradient backgrounds. Strict editorial styling utilizing `Inter Tight`, `Inter`, and `JetBrains Mono`.
- **Obfuscated API Keys**: The Hugging Face API key is encrypted using XOR in the payload so it isn't directly exposed to basic scrapers.
- **Local Gallery**: View, access, and download your previous generations within the session archive.

## Tech Stack

- **HTML5** (Semantic structure)
- **Vanilla CSS3** (CSS Variables, Flexbox/Grid, Viewport units)
- **Vanilla JavaScript** (Fetch API, Blob handling, DOM manipulation)

## Getting Started

Because the application uses ES6 modules and `fetch`, it must be run on a local development server (not directly via `file://`).

1. **Clone the repository:**
   ```bash
   git clone https://github.com/anzydev/Bot_playground.git
   cd Bot_playground
   ```

2. **Serve the directory:**
   Use any local web server. For example, with Python 3:
   ```bash
   python3 -m http.server 8080
   ```

3. **Open in Browser:**
   Navigate to `http://localhost:8080` in your web browser.

## Configuration & Security

The API Key is stored in `config.js`. 
For deployment, the key is currently XOR obfuscated within the `getter`. However, because this is a client-side application, the encryption is easily reversible by anyone analyzing the network payload or source code. 

**Warning:** Do not use a production/paid API key in this static client-side application if hosted publicly. For production, the API calls should be proxied through a secure backend server.

---
*Built with simplicity and brutalist typography principles.*
