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
const POLLINATIONS_FORCED_MODEL = "flux";
const POLLINATIONS_MODEL_CANDIDATES = [POLLINATIONS_FORCED_MODEL];
const POLLINATIONS_FULL_FLYER_MODEL_CANDIDATES = [POLLINATIONS_FORCED_MODEL];
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

const toBulletLines = (value, maxItems = 7, maxLength = 120) =>
  String(value || "")
    .split(/\n|\u2022|•|;/)
    .map((item) => item.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .slice(0, maxItems)
    .map((item) => `- ${item.slice(0, maxLength)}`);

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
Generate only the BACKGROUND artwork for a vertical college event poster (2:3 aspect ratio).
Theme: ${theme}.
Style direction: ${style}.
Event focus: ${eventTitle} by ${clubName} at ${venue} in ${collegeName}.
${themeKeywords[theme] || ""}.
${styleKeywords[style] || ""}.
Follow this composition blueprint used by the app layout:
- Keep a calm bright top strip and reserve top-left and top-right circular logo safe zones.
- Keep an upper-middle clean headline-safe area for a large event title overlay.
- Keep a lower-middle clean rectangular safe zone for a translucent details card overlay.
- Keep the bottom strip clean for date, venue, and contact footer text overlay.
Concentrate richer visual detail mostly on the right side and lower-right corner so the left and center remain readable.
Brand assets to accommodate in composition: ${collegeLogoPath || "college logo"} and ${clubLogoPath || "club logo"}.
Keep the center area visually rich but not cluttered so title and details overlay remain highly readable.
Visual cues to include: abstract futuristic technical graphics, circuit traces, polygon meshes, light data-flow lines, subtle neon accents.
Bright, high-key lighting with rich visual depth.
Keep center and top-middle areas readable for headline text overlays.
Use cinematic composition, premium quality, sharp details, and print-ready composition.
No text, no letters, no typography, no numbers, no logos, no watermark, no random characters, no gibberish.
No signs, no posters, no banners, no UI text, no interface panels, no infographics.
No people, no faces, no laptop screens, no monitors, no keyboards, no paper documents.
Avoid any object that typically carries readable text.
`.trim();
};

const buildFullFlyerPrompt = (payload) => {
  const theme = themes.includes(payload.theme) ? payload.theme : themes[0];
  const style = payload.style || "Minimal Modern";
  const collegeName = normalizePromptField(payload.collegeName || "Pillai College of Engineering", 120);
  const clubName = normalizePromptField(payload.clubName || "Club Name", 120);
  const eventTitle = normalizePromptField(payload.eventTitle || "Event Title", 140);
  const date = normalizePromptField(payload.date || "Not specified", 80);
  const time = normalizePromptField(payload.time || "Not specified", 80);
  const venue = normalizePromptField(payload.venue || "Not specified", 120);
  const details = normalizePromptField(payload.details || "Not specified", 420);
  const summary = normalizePromptField(payload.summary || "Not specified", 220);
  const contact = normalizePromptField(payload.contactNumbers || "Not specified", 120);
  const detailLines = toBulletLines(details, 8, 120);
  const detailsBlock = detailLines.length ? detailLines.join("\n") : "- Not specified";

  return `
Create one COMPLETE vertical college event flyer image with FINAL PRINTED TEXT included in the image.
Theme: ${theme}.
Style: ${style}.
${themeKeywords[theme] || ""}.
${styleKeywords[style] || ""}.

Canvas and quality:
- Portrait 2:3 layout
- High contrast, clean typography, strong readability
- Professional poster composition with clear spacing

Required layout order:
1) Top-center: ${collegeName}
2) Immediately below: ${clubName}
3) Main headline in very large font (once only): ${eventTitle}
4) Mid section heading: Event Details
5) Mid section body text (clear, readable, normal English):
${detailsBlock}
6) Near bottom line: Date & Time: ${date} ${time} | Venue: ${venue}
7) Bottom line: Summary: ${summary}
8) Bottom line: Contact: ${contact}

Design requirements:
- Use only the exact event text above; do not invent, rewrite, or omit content
- Keep all text in clear English and fully legible (no warped or broken letters)
- If a line is long, wrap it to the next line with proper spacing; never distort characters
- Keep one clean details panel in the center and a clean footer strip at the bottom
- Do not include pseudo-text/code fragments in the background
- No logos, emblems, badges, seals, or watermarks in generated artwork
- No gibberish, no random symbols, no mirrored text
- Print-ready poster quality
`.trim();
};

const buildPollinationsUrl = (baseUrl, prompt, seed, model, options = {}) => {
  const width = Number(options.width) > 0 ? Number(options.width) : FLYER_WIDTH;
  const height = Number(options.height) > 0 ? Number(options.height) : FLYER_HEIGHT;
  const enhance = options.enhance !== false;

  const params = new URLSearchParams({
    model,
    width: String(width),
    height: String(height),
    nologo: "true",
    enhance: enhance ? "true" : "false",
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

const getPollinationsImage = async (prompt, seed, options = {}) => {
  const modelCandidates = Array.isArray(options.modelCandidates) && options.modelCandidates.length
    ? options.modelCandidates
    : POLLINATIONS_MODEL_CANDIDATES;
  const requestOptions = {
    width: Number(options.width) > 0 ? Number(options.width) : FLYER_WIDTH,
    height: Number(options.height) > 0 ? Number(options.height) : FLYER_HEIGHT,
    enhance: options.enhance !== false,
  };
  const errors = [];
  const insufficientBalanceModels = new Set();

  for (const model of modelCandidates) {
    let modelBlockedByBalance = false;

    for (const endpoint of POLLINATIONS_IMAGE_ENDPOINTS) {
      for (let attempt = 1; attempt <= POLLINATIONS_MAX_ATTEMPTS; attempt += 1) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 45000);

        try {
          const response = await fetch(buildPollinationsUrl(endpoint.baseUrl, prompt, seed, model, requestOptions), {
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

  if (insufficientBalanceModels.size === modelCandidates.length) {
    throw new Error(
      `Insufficient Pollinations balance for configured model candidates (${modelCandidates.join(", "
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
  const prompt = wantsFullFlyer ? buildFullFlyerPrompt(payload) : buildFlyerPrompt(payload);
  const requestOptions = wantsFullFlyer
    ? {
        modelCandidates: POLLINATIONS_FULL_FLYER_MODEL_CANDIDATES,
        width: 1536,
        height: 2304,
        enhance: false,
      }
    : {
        modelCandidates: POLLINATIONS_MODEL_CANDIDATES,
        width: FLYER_WIDTH,
        height: FLYER_HEIGHT,
        enhance: true,
      };
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
    const generated = await getPollinationsImage(prompt, seed, requestOptions);

    return {
      prompt,
      provider: wantsFullFlyer ? "pollinations-full-flyer" : "pollinations-image",
      status: "ready",
      layout,
      message: `Generated with Pollinations (${generated.modelUsed}, seed ${seed}).`,
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
