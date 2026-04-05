import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../config.js";

const FLYER_WIDTH = 1024;
const FLYER_HEIGHT = 1536;
const POLLINATIONS_IMAGE_ENDPOINTS = [
  {
    label: "gen",
    baseUrl: "https://gen.pollinations.ai/image",
  },
  {
    label: "legacy",
    baseUrl: "https://image.pollinations.ai/prompt",
  },
];
const POLLINATIONS_PRIMARY_MODEL = config.pollinationsModel || "flux";
const POLLINATIONS_FALLBACK_MODELS = ["flux"];
const POLLINATIONS_MODEL_CANDIDATES = Array.from(
  new Set([POLLINATIONS_PRIMARY_MODEL, ...POLLINATIONS_FALLBACK_MODELS].filter(Boolean))
);
const POLLINATIONS_MAX_ATTEMPTS = 3;

export const themes = [
  "Technical",
  "Cultural",
  "Gaming",
  "Business",
  "Hackathon",
  "Workshop",
  "AI & Machine Learning",
  "Cybersecurity",
  "Robotics",
  "Startup & Innovation",
];

const themeKeywords = {
  Technical: "light digital patterns, soft blue gradients, abstract tech shapes",
  Cultural: "vibrant cultural motifs, elegant decorative geometry, festive atmosphere",
  Gaming: "esports inspired neon accents, dynamic abstract energy shapes, futuristic arena vibe",
  Business: "professional corporate visual language, modern business skyline silhouettes, clean layout",
  Hackathon: "coding sprint energy, digital abstract shapes, innovation-driven collaborative mood",
  Workshop: "bright workspace, laptop with code editor, clean desk, developers collaborating",
  "AI & Machine Learning": "light neural networks, glowing nodes, futuristic data flow",
  Cybersecurity: "minimal lock icons, secure digital mesh, clean technology gradients",
  Robotics: "sleek robotics lab, smart machine silhouettes, polished futurist environment",
  "Startup & Innovation": "startup pitch energy, bold modern gradients, innovation-centric visual language",
};

const styleKeywords = {
  "Minimal Modern": "minimal modern aesthetic, clean white space, balanced composition, subtle gradients",
  Glassmorphism: "glassmorphism layers, translucent panels, soft blur depth, polished contemporary look",
  Corporate: "corporate clean design, disciplined typography space, professional blue-white palette",
  "Retro & Vintage": "retro poster style, warm vintage tones, subtle paper texture, timeless editorial composition",
  "Geometric & Abstract": "bold geometric shapes, abstract forms, clean vector-like composition, structured visual rhythm",
  "Futuristic & Technical": "futuristic technical interface vibe, sleek neon accents, precise digital geometry, high-tech environment",
  "Bold Editorial": "high-impact editorial layout, strong contrast blocks, modern magazine-inspired art direction",
  "Neon Cyber": "cyberpunk neon palette, luminous gradients, moody futuristic energy, digital nightlife atmosphere",
};

const normalizePromptField = (value, maxLength = 220) =>
  String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);

export const buildFlyerPrompt = (payload) => {
  const theme = themes.includes(payload.theme) ? payload.theme : themes[0];
  const style = payload.style || "Minimal Modern";
  const collegeName = normalizePromptField(payload.collegeName || "Pillai College of Engineering", 120);
  const eventTitle = normalizePromptField(payload.eventTitle || "College event");
  const clubName = normalizePromptField(payload.clubName || "Student club", 120);
  const venue = normalizePromptField(payload.venue || "College campus", 120);
  const collegeLogoPath = normalizePromptField(payload.collegeLogoPath || "", 180);
  const clubLogoPath = normalizePromptField(payload.clubLogoPath || "", 180);

  return `
Vertical event flyer background for a college event poster.
Theme: ${theme}.
Style direction: ${style}.
Event focus: ${eventTitle} by ${clubName} at ${venue} in ${collegeName}.
${themeKeywords[theme] || ""}.
${styleKeywords[style] || ""}.
Keep a clean header strip and reserve top-left and top-right circular logo safe zones for official college and club logos.
Brand assets to accommodate in composition: ${collegeLogoPath || "college logo"} and ${clubLogoPath || "club logo"}.
Keep the center area visually rich but not cluttered so title and details overlay remain highly readable.
Visual cues to include: programming workshop vibe, laptop setup, coding symbols, collaborative student environment.
Bright, high-key lighting with rich visual depth.
Keep center and top-middle areas readable for headline text overlays.
Use cinematic composition, premium quality, sharp details, and print-ready composition.
No text, no letters, no typography, no numbers, no logos, no watermark, no random characters, no gibberish.
No signs, no posters, no banners, no UI text, no readable code on laptop screens.
If monitors are present, keep screen content abstract and blurred without any characters.
`.trim();
};

const enhancePromptWithGemini = async (payload) => {
  if (!config.geminiApiKey) {
    return null;
  }

  try {
    const genAI = new GoogleGenerativeAI(config.geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const theme = payload.theme || "Technical";
    const style = payload.style || "Minimal Modern";
    const eventTitle = payload.eventTitle || "College Event";
    const clubName = payload.clubName || "Student Club";

    const prompt = `
      You are an expert prompt engineer for AI image generators (like Midjourney or Flux).
      The user wants to generate a high-quality, professional BACKGROUND for a vertical college event flyer.
      
      The event is titled "${eventTitle}" by "${clubName}".
      Theme: ${theme}.
      Style: ${style}.
      
      Write a highly detailed, atmospheric, and artistic image prompt (maximum 200 words).
      Focus on:
      - Cinematic lighting and composition for a vertical poster (9:16 aspect ratio).
      - Textures, materials, and depth.
      - Elements that reflect the theme "${theme}" and style "${style}".
      - KEEP THE CENTER AND HEADER AREAS CLEAN (safe for text overlay).
      - NO TEXT, NO LETTERS, NO TYPOGRAPHY, NO LOGOS. This is a background-only request.
      - Use professional photography/digital art terminology (e.g., "bokeh", "unreal engine 5", "octane render", "8k", "hyper-realistic").

      Return ONLY the expanded prompt text.
    `.trim();

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("Gemini enhance error:", error);
    return null;
  }
};

const buildFullFlyerPrompt = (payload) => {
  const theme = themes.includes(payload.theme) ? payload.theme : themes[0];
  const style = payload.style || "Minimal Modern";
  const eventTitle = normalizePromptField(payload.eventTitle || "Event Title", 140);

  return `
    Ultra-high-quality vertical background for a professional college event poster.
    Artistic theme: ${theme}. Visual style: ${style}.
    Event inspiration: ${eventTitle}.
    ${themeKeywords[theme] || ""}.
    ${styleKeywords[style] || ""}.
    
    Composition rules:
    - Cinematic lighting, hyper-realistic details, and professional color grading.
    - High-impact visual center but leave top and middle areas clean for text overlay.
    - Smooth gradients and atmospheric depth.
    
    CRITICAL RESTRICTION:
    - ABSOLUTELY NO TEXT, NO LETTERS, NO NUMBERS, NO TYPOGRAPHY, NO SIGNS, NO LOGOS, NO WATERMARKS.
    - Do not include any readable characters or symbols on screens or backgrounds.
    - Pure visual art only.
  `.trim();
};

const buildPollinationsUrl = (baseUrl, prompt, seed, model) => {
  const params = new URLSearchParams({
    model,
    width: String(FLYER_WIDTH),
    height: String(FLYER_HEIGHT),
    nologo: "true",
    enhance: "true",
    private: "true",
    seed: String(seed),
  });

  if (config.pollinationsApiKey) {
    params.set("key", config.pollinationsApiKey);
  }

  return `${baseUrl}/${encodeURIComponent(prompt)}?${params.toString()}`;
};

const wait = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const compactErrorText = (value) =>
  String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 280);

const shouldRetryPollinations = (status, errorText) => {
  const normalized = String(errorText || "").toLowerCase();

  return (
    [408, 429, 500, 502, 503, 504].includes(status) ||
    normalized.includes("queue full") ||
    normalized.includes("overloaded") ||
    normalized.includes("timeout")
  );
};

const isInsufficientBalanceError = (status, errorText) => {
  const normalized = String(errorText || "").toLowerCase();
  return status === 402 && normalized.includes("insufficient balance");
};

const getPollinationsImage = async (prompt, seed) => {
  const errors = [];
  const insufficientBalanceModels = new Set();

  for (const model of POLLINATIONS_MODEL_CANDIDATES) {
    let modelBlockedByBalance = false;

    for (const endpoint of POLLINATIONS_IMAGE_ENDPOINTS) {
      for (let attempt = 1; attempt <= POLLINATIONS_MAX_ATTEMPTS; attempt += 1) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 45000);

        try {
          const response = await fetch(buildPollinationsUrl(endpoint.baseUrl, prompt, seed, model), {
            headers: {
              Accept: "image/*",
              ...(config.pollinationsApiKey
                ? {
                    Authorization: `Bearer ${config.pollinationsApiKey}`,
                  }
                : {}),
            },
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (response.ok) {
            const contentType = response.headers.get("content-type") || "image/jpeg";
            if (!contentType.startsWith("image/")) {
              const payloadText = compactErrorText(await response.text().catch(() => ""));
              throw new Error(`Pollinations did not return an image. ${payloadText}`.trim());
            }

            const bytes = await response.arrayBuffer();
            const imageBase64 = Buffer.from(bytes).toString("base64");
            return { contentType, imageBase64, modelUsed: model };
          }

          const errorText = compactErrorText(await response.text().catch(() => ""));
          errors.push(`${model} ${endpoint.label} attempt ${attempt}: ${response.status} ${errorText}`.trim());

          if (isInsufficientBalanceError(response.status, errorText)) {
            insufficientBalanceModels.add(model);
            modelBlockedByBalance = true;
            break;
          }

          if (response.status === 401 && !config.pollinationsApiKey) {
            break;
          }

          if (shouldRetryPollinations(response.status, errorText) && attempt < POLLINATIONS_MAX_ATTEMPTS) {
            await wait(700 * attempt + Math.floor(Math.random() * 350));
            continue;
          }

          break;
        } catch (error) {
          clearTimeout(timeoutId);
          const message = compactErrorText(error instanceof Error ? error.message : "Request failed");
          errors.push(`${model} ${endpoint.label} attempt ${attempt}: ${message}`);

          if (attempt < POLLINATIONS_MAX_ATTEMPTS) {
            await wait(700 * attempt + Math.floor(Math.random() * 350));
            continue;
          }

          break;
        }
      }

      if (modelBlockedByBalance) {
        break;
      }
    }
  }

  if (insufficientBalanceModels.size === POLLINATIONS_MODEL_CANDIDATES.length) {
    throw new Error(
      `Insufficient Pollinations balance for configured model candidates (${POLLINATIONS_MODEL_CANDIDATES.join(", "
      )}). Top up pollen or switch to a lower-cost model.`
    );
  }

  const keyHint = config.pollinationsApiKey
    ? ""
    : " Add POLLINATIONS_API_KEY from https://enter.pollinations.ai for better reliability and higher capacity.";

  throw new Error(
    `Pollinations request failed after retries.${keyHint} ${errors.slice(-4).join(" | ")}`.trim()
  );
};

export const generateFlyerConcept = async (payload) => {
  const wantsFullFlyer = payload.aiMode === "full-flyer" || payload.generateFullFlyer === true;
  
  let prompt = wantsFullFlyer ? buildFullFlyerPrompt(payload) : buildFlyerPrompt(payload);
  let enhancedByGemini = false;

  // Use Gemini to make the prompt super high quality if possible
  const enhancedPrompt = await enhancePromptWithGemini(payload);
  if (enhancedPrompt) {
    prompt = enhancedPrompt;
    enhancedByGemini = true;
  }
  const layout = {
    collegeName: payload.collegeName || "Pillai College of Engineering",
    clubName: payload.clubName || "Club Name",
    title: payload.eventTitle || "Event Title",
    dimensions: {
      width: FLYER_WIDTH,
      height: FLYER_HEIGHT,
    },
  };

  try {
    const seed = Number.isFinite(Number(payload.seed)) ? Number(payload.seed) : Math.floor(Math.random() * 10000000);
    const generated = await getPollinationsImage(prompt, seed);

    return {
      prompt,
      provider: enhancedByGemini ? "gemini-pollinations" : (wantsFullFlyer ? "pollinations-full-flyer" : "pollinations-image"),
      status: "ready",
      layout,
      message: `Generated with Pollinations (${generated.modelUsed}, seed ${seed})${enhancedByGemini ? " using Gemini-enhanced prompting" : ""}.`,
      imageBase64: generated.imageBase64,
      fullFlyerContentType: wantsFullFlyer ? generated.contentType : null,
      fullFlyerBase64: wantsFullFlyer ? generated.imageBase64 : null,
      backgroundContentType: wantsFullFlyer ? null : generated.contentType,
      backgroundBase64: wantsFullFlyer ? null : generated.imageBase64,
    };
  } catch (error) {
    return {
      prompt,
      provider: "prompt-only",
      status: "mocked",
      message: error instanceof Error ? `Pollinations image generation failed. ${error.message}` : "Pollinations image generation failed.",
      layout,
      imageBase64: null,
      fullFlyerBase64: null,
      fullFlyerContentType: null,
      backgroundBase64: null,
      backgroundContentType: null,
    };
  }
};
