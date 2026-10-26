import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Local JSON Database Helper for Seeker Records
const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "seekers.json");

// Ensure data folder and seekers.json exist
function initDatabase() {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), "utf-8");
    }
  } catch (error) {
    console.error("Failed to initialize seekers database:", error);
  }
}

initDatabase();

// Load seekers from local JSON file
function getSeekersList(): any[] {
  try {
    initDatabase();
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data || "[]");
  } catch (error) {
    console.error("Error reading seekers database:", error);
    return [];
  }
}

// Save seekers to local JSON file
function saveSeekersList(seekers: any[]): boolean {
  try {
    initDatabase();
    fs.writeFileSync(DB_FILE, JSON.stringify(seekers, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Error writing to seekers database:", error);
    return false;
  }
}

// Lazy initialize GoogleGenAI client to avoid crash if env is missing at startup
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required. Please set it in AI Studio Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Full-stack API Route for Tattoo Suggestion
app.post("/api/suggest-tattoo", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      gender,
      birthDate,
      birthTime,
      birthPlace,
      intention,
      need,
      placementPreference,
      preferredLanguage = "English"
    } = req.body;

    if (!birthDate || !intention || !need) {
      return res.status(400).json({ error: "Missing required fields for consultation." });
    }

    const ai = getGeminiClient();

    const userPrompt = `
      Please conduct a deep spiritual tattoo advisory consultation for a user with the following profile:
      - Full Name: ${firstName || "Unknown"} ${lastName || ""}
      - Gender Alignment: ${gender || "Unknown"}
      - Birth Date: ${birthDate}
      - Birth Time: ${birthTime || "Unknown"}
      - Birth Place: ${birthPlace || "Unknown"}
      - Primary Intention / Healing Goal: ${intention} (e.g. financial stability, emotional peace, protection, etc.)
      - Emotional / Psychological Need: ${need} (e.g. healing trauma, self-love, overcoming creative blocks)
      - Body Placement Preference: ${placementPreference || "Let the app choose"}
      - Preferred Language for explanation and mantras: ${preferredLanguage}

      Based on this data:
      1. CRITICAL: All user-facing text properties inside the JSON (including 'summary', 'imbalanceAnalysis', 'reikiSymbol', 'vedicRemedy', 'title', 'symbolism', 'style', 'colors', 'placement', 'placementReason', 'culturalRespect', 'simpleDesc', 'moderateDesc', 'advancedDesc', 'size', 'direction') MUST be written in the following language: ${preferredLanguage}. If the preferred language is Hindi, use Hindi with Devanagari script. If Spanish, use Spanish. If English, use English. Do not translate the XML tag names or SVG code elements; only translate the readable descriptions.
      2. Address the user directly by their first name (${firstName || "Seeker"}) throughout the summary and explanation to make it deeply personal, warm, and comforting in their language (${preferredLanguage}).
      3. Recommended Tattoo Style: Choose the most spiritually and aesthetically aligned tattoo style (e.g., 'Vedic / Yantra', 'Sacred Geometry & Fine-line', 'Botanical Alchemy', 'Alchemical Sigils', 'Minimalist Celestial') for their profile.
      4. Astrology Blueprint: Estimate the Sun, Moon, and Rising sign along with a dominant planet, and create a highly customized interpretation of these alignment energies relative to their healing goals and gender energy alignment.
      5. Life Area / Chakra Mapping: Identify the primary imbalanced or target Chakra, analyze the emotional root cause, and prescribe a Reiki symbol and Vedic Kavach (shield) or Mantra.
      6. Custom Tattoo Concept: Detail a beautiful, symbolic tattoo design. Describe its elements, recommended ink colors, and structural placement. Provide a highly specialized Midjourney/DALL-E prompt. Write a note on cultural respect/appropriation.
      7. Dynamic Vector talismans in 3 Complexity Levels:
         Provide three alternative designs in the response:
         - Simple: Clean, minimalist, low line density, easy to tattoo (1-2 key sacred lines or symbols).
         - Moderate: Balanced concentric design, medium line density (yantra/mandala/geometric mix).
         - Advanced: Intricate, rich detailed layout, high line density (full cosmos constellation, layered geometric arrays, detailed petals).
         Each of these MUST be valid SVGs, starting with "<svg viewBox='0 0 100 100' fill='none' stroke='currentColor' stroke-width='1.5'>" and ending with "</svg>". Inside, draw elegant sacred geometry using path, circle, line, rect etc. Do not include markdown wraps or backticks inside the json string itself.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: `You are AstroPsyche, an enlightened spiritual tattoo advisor, master astrologer, energy healer (Chakras/Reiki), and clinical psychologist. 
        You decode birth alignments, psychological wounds, and intention energy to design sacred modern talismans.
        You must return the prescription in the exact JSON format requested. Your SVG markups must be clean, valid, elegant vector graphics representing three beautiful levels of tattoo complexity, styled perfectly.
        CRITICAL RULE FOR DESIGN ELEMENTS: In the 'tattoo_concept.elements' list and all text fields, only mention or describe elements that are actually present or mixed inside this specific tattoo design. Do not mention other elements (such as 'Sun Shri Yantra', 'Unalome', etc.) if they are not explicitly present in the generated tattoo SVG or concept.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            astrology: {
              type: Type.OBJECT,
              properties: {
                sunSign: { type: Type.STRING },
                moonSign: { type: Type.STRING },
                risingSign: { type: Type.STRING },
                dominantPlanet: { type: Type.STRING },
                summary: { type: Type.STRING, description: "Detailed astrological alignment breakdown of their planetary energies regarding their intentions." }
              },
              required: ["sunSign", "moonSign", "risingSign", "dominantPlanet", "summary"]
            },
            chakra_energy: {
              type: Type.OBJECT,
              properties: {
                targetChakra: { type: Type.STRING, description: "e.g., Root, Sacral, Solar Plexus, Heart, Throat, Third Eye, Crown" },
                imbalanceAnalysis: { type: Type.STRING, description: "Detailed analysis of why this chakra was chosen and how it links to their emotional needs." },
                reikiSymbol: { type: Type.STRING, description: "Recommended Reiki symbol (e.g. Cho Ku Rei, Sei He Ki, Unalome) and how to activate it." },
                vedicRemedy: { type: Type.STRING, description: "A protective Vedic mantra or Kavach yantra description." }
              },
              required: ["targetChakra", "imbalanceAnalysis", "reikiSymbol", "vedicRemedy"]
            },
            tattoo_concept: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                symbolism: { type: Type.STRING, description: "The deep symbolic narrative of this custom layout." },
                style: { type: Type.STRING, description: "The recommended tattoo style, e.g. 'Vedic / Yantra', 'Sacred Geometry & Fine-line', 'Botanical Alchemy', 'Alchemical Sigils', 'Minimalist Celestial'." },
                elements: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "List of the concrete artistic elements included (e.g., 'fine-line lotus', 'crescent moon phases', 'geometric Swastika or Swastik-inspired lines', 'Unalome curve')."
                },
                colors: { type: Type.STRING, description: "Ink color suggestions and their energetic frequency explanation." },
                placement: { type: Type.STRING, description: "The physical placement on the body. CRITICAL RULE: Since sacred geometric symbols or spiritual yantras/OM symbols carry high positive spiritual frequencies, they are strictly forbidden from being placed below the waist (avoid ankles, feet, legs, lower limbs entirely). You MUST recommend one of these three exact placements ABOVE the waist: 'Upper Back', 'Left Chest', or 'Right Upper Arm'. Choose the one that fits best with their natal energy goals." },
                placementReason: { type: Type.STRING, description: "Energetic and physiological justification for placing the tattoo on this specific acupuncture/meridian/chakra area." },
                painIndex: { type: Type.INTEGER, description: "Estimated pain level from 1 to 10." },
                energySensitivity: { type: Type.INTEGER, description: "Energetic sensitivity level from 1 to 10." },
                midjourneyPrompt: { type: Type.STRING, description: "A detailed design prompt for Midjourney/DALL-E 3, focusing on a clean tattoo concept on white background." },
                culturalRespect: { type: Type.STRING, description: "Mindful notes on the historical/cultural origin of the symbols and how to honor them respectfully." },
                svgMarkup: { type: Type.STRING, description: "A valid, beautiful, minimalist SVG. Draw a gorgeous sacred symbol (combining thin vector lines, concentric circles, astrological constellation nodes, or a geometric pattern) using stroke='currentColor', fill='none', and stroke-width='1.5'. The outer tag MUST be <svg viewBox='0 0 100 100' fill='none' stroke='currentColor' stroke-width='1.5'> and inner tags can be path, circle, line, rect etc. Do not use any markdown formatting inside this string. (Duplicate of moderate version for compatibility)" },
                svgMarkupSimple: { type: Type.STRING, description: "A simple version of the custom sacred symbol (featuring 1-2 key clean minimalist vector lines and a main geometric glyph, low line density, easy to tattoo)." },
                svgMarkupModerate: { type: Type.STRING, description: "A moderate complexity version of the custom sacred symbol (adds an elegant outer orbit or concentric circle, balanced line density, traditional yantra/mandala details)." },
                svgMarkupAdvanced: { type: Type.STRING, description: "An advanced, rich, intricate version of the custom sacred symbol (fully detailed orbital patterns, multiple intersecting geometric lines, star nodes, complex alchemical sigils, high line density)." },
                simpleDesc: { type: Type.STRING, description: "A short 1-sentence poetic explanation of what elements are simplified or highlighted in this Simple version." },
                moderateDesc: { type: Type.STRING, description: "A short 1-sentence poetic explanation of the balanced union of elements in this Moderate version." },
                advancedDesc: { type: Type.STRING, description: "A short 1-sentence poetic explanation of the full cosmic details present in this Advanced version." },
                size: { type: Type.STRING, description: "The recommended physical size and scaling parameters of the tattoo." },
                direction: { type: Type.STRING, description: "The dynamic flow or rotational alignment direction on the body." }
              },
              required: [
                "title", "symbolism", "style", "elements", "colors", "placement", "placementReason",
                "painIndex", "energySensitivity", "midjourneyPrompt", "culturalRespect", "svgMarkup",
                "svgMarkupSimple", "svgMarkupModerate", "svgMarkupAdvanced", "simpleDesc", "moderateDesc", "advancedDesc",
                "size", "direction"
              ]
            }
          },
          required: ["astrology", "chakra_energy", "tattoo_concept"]
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);
  } catch (error: any) {
    console.error("Error in tattoo suggestion API:", error);
    res.status(500).json({
      error: "We encountered a misalignment in the spiritual data streams.",
      details: error.message || error
    });
  }
});

// Full-stack API Route for Custom Sigil Analysis
app.post("/api/analyze-sigil", async (req, res) => {
  try {
    const { chakra, zodiac, planet, intention } = req.body;

    if (!chakra || !zodiac || !planet) {
      return res.status(400).json({ error: "Missing parameters for sigil analysis." });
    }

    const ai = getGeminiClient();

    const userPrompt = `
      Please channel a deep, mystical, and therapeutic energetic reading for a custom combined sigil representing:
      - Sacred Foundation: ${chakra}
      - Celestial Element: ${zodiac} Astrological Sign
      - Steering Frequency: ${planet} Planet
      - User's Personal Intention: ${intention || "General energetic centering & protective shielding"}

      Analyze how these three elements interact when layered together.
      Provide:
      1. A unique, mystical, Sanskrit-inspired or ancient-sounding Title for the combined sigil.
      2. Resonance: How the sacred geometry of the chakra combines with the astrological element to create a healing portal.
      3. Psyche Alignment: The psychological and somatic healing mechanism (how it releases tension or stores power).
      4. Practical Mantra: A short, elegant activation mantra that the user can chant during the tattoo ritual.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: `You are AstroPsyche, an enlightened spiritual tattoo advisor, master astrologer, and clinical psychologist.
        You decode birth alignments, psychological blockages, and intention energies.
        Your tone is deeply poetic, comforting, sophisticated, and ancient, yet rooted in somatic healing.
        Return the result in the exact JSON format requested. Do not include markdown wraps or backticks inside the json string itself.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "A mystical, elevated, or Sanskrit-inspired name for this composite sigil." },
            resonance: { type: Type.STRING, description: "Poetic explanation of how the chakra geometry, zodiac element, and planetary force intersect." },
            psycheAlignment: { type: Type.STRING, description: "Detailed psychological and somatic resonance of this combined shape, explaining what blockages it dissolves." },
            practicalMantra: { type: Type.STRING, description: "A highly focused, beautiful affirmation or mantra to activate the talisman." }
          },
          required: ["title", "resonance", "psycheAlignment", "practicalMantra"]
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);
  } catch (error: any) {
    console.warn("Gemini sigil analysis failed, falling back to client-side explanation:", error.message);
    res.status(500).json({
      error: "Celestial stream disconnected.",
      details: error.message || error
    });
  }
});

// Database API: Save new seeker consultation record
app.post("/api/save-seeker", (req, res) => {
  try {
    const {
      firstName,
      lastName,
      gender,
      birthDate,
      birthTime,
      birthPlace,
      intention,
      need,
      preferredLanguage,
      suggestion,
      deviceSignature
    } = req.body;

    if (!birthDate || !intention || !suggestion) {
      return res.status(400).json({ error: "Missing essential seeker parameters to persist in database." });
    }

    const seekers = getSeekersList();

    const newSeeker = {
      id: "seeker_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now(),
      createdAt: new Date().toISOString(),
      firstName: firstName || "Anonymous",
      lastName: lastName || "",
      gender: gender || "Not Specified",
      birthDate,
      birthTime: birthTime || "Unknown",
      birthPlace: birthPlace || "Unknown",
      intention,
      need: need || "General spiritual enhancement",
      preferredLanguage: preferredLanguage || "English",
      deviceSignature: deviceSignature || "anonymous_soul",
      suggestion
    };

    seekers.unshift(newSeeker); // Add to the front of the array (newest first)
    const success = saveSeekersList(seekers);

    if (success) {
      res.json({ success: true, seeker: newSeeker });
    } else {
      res.status(500).json({ error: "Failed to write seeker record to file system." });
    }
  } catch (err: any) {
    console.error("Error saving seeker to database:", err);
    res.status(500).json({ error: "Internal server error during seeker registry.", details: err.message });
  }
});

// Database API: Retrieve all seeker consultation records (supports filtering by deviceSignature or unlocking via master passkey)
app.get("/api/get-seekers", (req, res) => {
  try {
    const { deviceSignature, passcode } = req.query;
    const seekers = getSeekersList();

    const masterPasscode = process.env.MASTER_LEDGER_PASSCODE || "AstroPsyche2026";
    const isMasterAuthorized = passcode === masterPasscode;

    // Filter seekers to secure individual records
    const securedSeekers = seekers.filter((s) => {
      // Authorized master practitioner can view everything
      if (isMasterAuthorized) return true;
      
      // If client signature matches, allow view
      if (deviceSignature && s.deviceSignature === deviceSignature) return true;

      // Backward compatibility: If no signature exists on older records, hide them from public view
      return false;
    });

    res.json(securedSeekers);
  } catch (err: any) {
    console.error("Error retrieving seekers from database:", err);
    res.status(500).json({ error: "Failed to retrieve seekers ledger.", details: err.message });
  }
});

// Database API: Delete a seeker record (verifies signature or master passcode)
app.delete("/api/delete-seeker/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { deviceSignature, passcode } = req.query;

    const masterPasscode = process.env.MASTER_LEDGER_PASSCODE || "AstroPsyche2026";
    const isMasterAuthorized = passcode === masterPasscode;

    let seekers = getSeekersList();
    const targetSeeker = seekers.find((s) => s.id === id);

    if (!targetSeeker) {
      return res.status(404).json({ error: "Seeker record not found." });
    }

    // Security Gate: Check if current caller is owner of record or holds Master passcode
    const canDelete = isMasterAuthorized || (deviceSignature && targetSeeker.deviceSignature === deviceSignature);
    if (!canDelete) {
      return res.status(403).json({ error: "Access Denied: You are not authorized to release this soul from the ledger." });
    }

    seekers = seekers.filter((s) => s.id !== id);
    const success = saveSeekersList(seekers);
    if (success) {
      res.json({ success: true, message: "Seeker record released from cosmic ledger." });
    } else {
      res.status(500).json({ error: "Failed to update database file." });
    }
  } catch (err: any) {
    console.error("Error deleting seeker from database:", err);
    res.status(500).json({ error: "Internal server error during record deletion.", details: err.message });
  }
});

// Download endpoints for Source Code PDF deposits (Copyright / IP registration)
app.get("/download/:file", (req, res) => {
  const fileKey = req.params.file.toLowerCase().replace(/\.pdf$/, "");
  const fileMap: Record<string, string> = {
    "first-10-pages": "first_10_pages_source_code.pdf",
    "last-10-pages": "last_10_pages_source_code.pdf",
    "first_10_pages_source_code": "first_10_pages_source_code.pdf",
    "last_10_pages_source_code": "last_10_pages_source_code.pdf",
    "first-10-pages-app": "first_10_pages_app_tsx.pdf",
    "last-10-pages-app": "last_10_pages_app_tsx.pdf",
  };
  const targetFileName = fileMap[fileKey] || (req.params.file.endsWith(".pdf") ? req.params.file : null);
  if (!targetFileName) {
    return res.status(404).send("Requested deposit file not found.");
  }
  const targetPath = path.join(process.cwd(), "public", targetFileName);
  if (fs.existsSync(targetPath)) {
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${targetFileName}"`);
    return res.sendFile(targetPath);
  }
  return res.status(404).send("Deposit file not found on server.");
});

app.get("/api/download-source-pdf/:file", (req, res) => {
  const fileKey = req.params.file.toLowerCase().replace(/\.pdf$/, "");
  const fileMap: Record<string, string> = {
    "first-10-pages": "first_10_pages_source_code.pdf",
    "last-10-pages": "last_10_pages_source_code.pdf",
    "first-10-pages-app": "first_10_pages_app_tsx.pdf",
    "last-10-pages-app": "last_10_pages_app_tsx.pdf",
  };
  const targetFileName = fileMap[fileKey] || (req.params.file.endsWith(".pdf") ? req.params.file : null);
  if (!targetFileName) {
    return res.status(404).send("Requested deposit file not found.");
  }
  const targetPath = path.join(process.cwd(), "public", targetFileName);
  if (fs.existsSync(targetPath)) {
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${targetFileName}"`);
    return res.sendFile(targetPath);
  }
  return res.status(404).send("Deposit file not found on server.");
});

// Configure Vite middleware and static asset serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);

    app.use("*", async (req, res, next) => {
      if (req.originalUrl.startsWith("/api") || req.originalUrl.startsWith("/download") || req.originalUrl.endsWith(".pdf")) {
        return next();
      }
      try {
        const indexPath = path.resolve(process.cwd(), "index.html");
        let template = fs.readFileSync(indexPath, "utf-8");
        template = await vite.transformIndexHtml(req.originalUrl, template);
        res.status(200).set({ "Content-Type": "text/html" }).send(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      const indexPath = path.join(distPath, "index.html");
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send("Application dist build not found.");
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
