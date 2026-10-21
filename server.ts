import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "5mb" }));

  // API Route for translation
  app.post("/api/translate", async (req, res) => {
    try {
      const { texts, targetLanguage } = req.body;
      
      if (!texts || !Array.isArray(texts) || texts.length === 0) {
        return res.status(400).json({ error: "texts must be a non-empty array of strings" });
      }
      
      if (!targetLanguage) {
        return res.status(400).json({ error: "targetLanguage is required" });
      }

      // Check if GEMINI_API_KEY is configured
      if (!process.env.GEMINI_API_KEY) {
        return res.json({ translations: texts, warning: "GEMINI_API_KEY is not configured" });
      }

      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const prompt = `You are an expert, professional, and culturally-nuanced translator.
Translate the following array of text strings (which may be in English, Korean, or mixed) into ${targetLanguage}.
Guidelines:
1. Maintain exactly the same meaning, tone, emotion, and format of the original strings.
2. Keep any technical terms, proper names (like names of Korean palaces, locations, food), and numbers accurate. Feel free to use romanized names alongside translations if it makes it easier for travelers (e.g. "Gyeongbokgung (경복궁)").
3. Ensure any Markdown or inline tags (like HTML) remain unchanged.
4. Return a JSON object containing the translations under the 'translations' key as a string array in the exact same index order.

Here is the JSON array of strings to translate:
${JSON.stringify(texts, null, 2)}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You only output valid JSON containing an array of strings under the key 'translations'. The length of the output array must exactly match the input array.",
          responseMimeType: "application/json",
          temperature: 0.1,
        },
      });

      const text = response.text || "{}";
      const result = JSON.parse(text);
      
      if (result && Array.isArray(result.translations)) {
        res.json({ translations: result.translations });
      } else {
        throw new Error("Invalid response schema from translation service");
      }
    } catch (error: any) {
      const isQuotaError = error.message?.includes("quota") || error.message?.includes("429") || error.message?.includes("RESOURCE_EXHAUSTED");
      if (isQuotaError) {
        console.warn("Translation API: Rate limit or quota exceeded. Falling back to original text.");
      } else {
        console.error("Translation API error:", error);
      }
      // Fallback gracefully to the input texts so that the application doesn't crash or throw exceptions
      res.json({ 
        translations: req.body?.texts || [], 
        error: error.message || "Failed to translate",
        quotaExceeded: isQuotaError
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
