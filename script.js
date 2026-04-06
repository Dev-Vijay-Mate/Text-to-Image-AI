// ============================================================
// script.js — AI Image Generator (Hugging Face SDXL)
// ============================================================

// ── DOM References ────────────────────────────────────────────
const promptInput = document.getElementById("promptInput");
const generateBtn = document.getElementById("generateBtn");
const loader = document.getElementById("loader");
const errorBanner = document.getElementById("errorBanner");
const errorText = document.getElementById("errorText");
const result = document.getElementById("result");
const resultImage = document.getElementById("resultImage");
const resultPrompt = document.getElementById("resultPrompt");
const gallery = document.getElementById("gallery");
const galleryGrid = document.getElementById("galleryGrid");
const galleryCount = document.getElementById("galleryCount");
const genCounterEl = document.getElementById("genCounter");
const statusIndicatorEl = document.getElementById("statusIndicator");
const charCounterEl = document.getElementById("charCounter");

// ── State ─────────────────────────────────────────────────────
let generationHistory = [];
let totalGenerations = 0;

// ── Surprise Me Prompts ──────────────────────────────────────
const SURPRISE_PROMPTS = [
  "A translucent crystal castle floating above a bioluminescent ocean, ethereal lighting, 8k detail",
  "Steampunk mechanical owl perched on a clock tower, brass gears, golden hour, hyper-realistic",
  "Ancient Japanese temple during cherry blossom season, fog, cinematic composition, Makoto Shinkai style",
  "An astronaut meditating on Saturn's rings with Earth in the background, cosmic art, volumetric light",
  "Underwater city with coral architecture and jellyfish lanterns, deep sea blue, concept art",
  "A massive library inside a hollow tree trunk, magical floating books, warm candlelight, fantasy art",
  "Neon-lit ramen shop in a rainy Tokyo alley, cyberpunk aesthetic, reflections, ultra detailed",
  "Portrait of a wolf made entirely of northern lights aurora, dark sky background, digital painting",
  "Floating islands with waterfalls pouring into clouds, Studio Ghibli inspired, dreamy atmosphere",
  "A vintage train traveling through a field of giant sunflowers at sunset, oil painting style",
  "Futuristic race car made of light streaks on a Tron-like grid, neon blue and pink, 3D render",
  "A phoenix bursting from flames in a dark cathedral, stained glass reflections, dramatic lighting"
];

// ── Character Counter ─────────────────────────────────────────
promptInput.addEventListener("input", () => {
  const len = promptInput.value.length;
  charCounterEl.textContent = `${len} / 500`;
  if (len > 450) {
    charCounterEl.style.color = "#fbbf24";
  } else {
    charCounterEl.style.color = "";
  }
});

// ============================================================
// CORE: Generate Image via Hugging Face API
// ============================================================
async function generateImage(prompt) {
  if (typeof CONFIG === "undefined") {
    throw new Error("CONFIG is not defined. Make sure config.js is loaded.");
  }
  if (!CONFIG.IMAGE_API_KEY || CONFIG.IMAGE_API_KEY === "YOUR_KEY_HERE") {
    throw new Error("Hugging Face API token is missing.");
  }

  const response = await fetch(CONFIG.IMAGE_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${CONFIG.IMAGE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ inputs: prompt }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    if (response.status === 401 || response.status === 403) {
      throw new Error("Invalid or expired API token.");
    }
    if (response.status === 503) {
      throw new Error(errorData?.error || "Model loading — retry in ~30s.");
    }
    if (response.status === 429) {
      throw new Error("Rate limit exceeded — wait a moment.");
    }
    throw new Error(errorData?.error || `API error: ${response.status}`);
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
}

// ============================================================
// UI HELPERS
// ============================================================
function setLoading(isLoading) {
  if (isLoading) {
    loader.classList.add("visible");
    result.classList.remove("visible");
    generateBtn.disabled = true;
    promptInput.disabled = true;
    updateStatus("⏳ Generating...");
  } else {
    loader.classList.remove("visible");
    generateBtn.disabled = false;
    promptInput.disabled = false;
  }
}

function updateStatus(text) {
  if (statusIndicatorEl) statusIndicatorEl.textContent = text;
}

function updateGenCount() {
  totalGenerations++;
  if (genCounterEl) genCounterEl.textContent = totalGenerations;
}

function showError(message) {
  errorText.textContent = message;
  errorBanner.classList.add("visible");
  result.classList.remove("visible");
  updateStatus("❌ Error");
  setTimeout(() => {
    hideError();
    updateStatus("⬤ Ready");
  }, 10000);
}

function hideError() {
  errorBanner.classList.remove("visible");
}

function showResult(imageUrl, prompt) {
  resultImage.src = imageUrl;
  resultPrompt.textContent = `"${prompt}"`;
  result.classList.add("visible");
  result.scrollIntoView({ behavior: "smooth", block: "start" });
}

function addToGallery(imageUrl, prompt) {
  generationHistory.unshift({ imageUrl, prompt });
  gallery.classList.add("visible");
  galleryCount.textContent = `${generationHistory.length} RECORD${generationHistory.length !== 1 ? "S" : ""}`;

  const item = document.createElement("div");
  item.className = "gallery__item";
  item.onclick = () => {
    showResult(imageUrl, prompt);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const img = document.createElement("img");
  img.src = imageUrl;
  img.alt = prompt;
  img.loading = "lazy";

  const overlay = document.createElement("div");
  overlay.className = "gallery__item-overlay";

  const p = document.createElement("span");
  p.className = "gallery__item-prompt";
  p.textContent = prompt;

  overlay.appendChild(p);
  item.appendChild(img);
  item.appendChild(overlay);
  galleryGrid.prepend(item);
}

// ============================================================
// EVENT HANDLERS
// ============================================================
async function handleGenerate() {
  const prompt = promptInput.value.trim();

  if (!prompt) {
    promptInput.focus();
    promptInput.style.borderColor = "#ff2d95";
    promptInput.placeholder = "⚠ Please describe what you'd like to generate...";
    setTimeout(() => {
      promptInput.style.borderColor = "";
      promptInput.placeholder = "A cyberpunk samurai standing on a neon rooftop, rain, volumetric lighting, ultra detailed, 8k...";
    }, 2500);
    return;
  }

  hideError();
  setLoading(true);

  try {
    const imageUrl = await generateImage(prompt);
    showResult(imageUrl, prompt);
    addToGallery(imageUrl, prompt);
    updateGenCount();
    updateStatus("⬤ Ready");
    promptInput.value = "";
    charCounterEl.textContent = "0 / 500";
  } catch (error) {
    showError(error.message);
    console.error("Generation error:", error);
  } finally {
    setLoading(false);
  }
}

function useChip(chipElement) {
  // Strip emoji prefix for cleaner prompt
  const text = chipElement.textContent.trim();
  promptInput.value = text;
  charCounterEl.textContent = `${text.length} / 500`;
  promptInput.focus();
}

function handleSurprise() {
  const prompt = SURPRISE_PROMPTS[Math.floor(Math.random() * SURPRISE_PROMPTS.length)];
  promptInput.value = prompt;
  charCounterEl.textContent = `${prompt.length} / 500`;
  promptInput.focus();
}

function downloadImage() {
  const src = resultImage.src;
  if (!src) return;
  const link = document.createElement("a");
  link.href = src;
  link.download = `imageforge-${Date.now()}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ── Keyboard Shortcuts ────────────────────────────────────────
promptInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    handleGenerate();
  }
});

// ── Init ──────────────────────────────────────────────────────
window.addEventListener("DOMContentLoaded", () => {
  promptInput.focus();
  updateStatus("⬤ Ready");
});
