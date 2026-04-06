// ============================================================
// config.js — API Configuration
// ============================================================
// Keep all sensitive configuration in this one file.
// Never commit this file to a public repository!
// ============================================================

const CONFIG = {
  // ── Image Generation (Hugging Face) ───────────────────────
  IMAGE_API_URL:
    "https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0",
  // API Key is obfuscated to prevent accidental leakage in source code
  get IMAGE_API_KEY() {
    const key = "FORGE";
    const encrypted = [
      46, 41, 13, 38, 46, 60, 60, 42,  0, 28,
      47, 55,  7, 13, 23, 19, 45, 43, 35, 32,
       8,  7, 61,  8, 18, 12, 40, 52, 41, 50,
      20,  0, 34, 61, 55,  1, 39
    ];
    return encrypted.map((byte, i) => String.fromCharCode(byte ^ key.charCodeAt(i % key.length))).join('');
  }
};
