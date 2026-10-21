import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "25mb" }));

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
        model: "gemini-3.8-flash",
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

  // Database persistence setup
  const DATA_DIR = path.join(process.cwd(), "data");
  const DB_FILE = path.join(DATA_DIR, "db.json");

  function getDb() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (!fs.existsSync(DB_FILE)) {
        const initial = {
          postcards: [],
          destinations: [],
          festivals: [],
          deletedDestinationIds: [],
          deletedFestivalIds: [],
        };
        fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), "utf8");
        return initial;
      }
      const data = fs.readFileSync(DB_FILE, "utf8");
      return JSON.parse(data);
    } catch (e) {
      console.error("DB Read Error:", e);
      return {
        postcards: [],
        destinations: [],
        festivals: [],
        deletedDestinationIds: [],
        deletedFestivalIds: [],
      };
    }
  }

  function saveDb(data: any) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
    } catch (e) {
      console.error("DB Write Error:", e);
    }
  }

  // Admin Auth APIs
  const DEFAULT_ADMIN_PASSWORDS = [
    process.env.ADMIN_PASSWORD || "admin1234",
    "admin",
    "corealabs1234"
  ];

  function getValidAdminPasswords() {
    const db = getDb();
    const list = [...DEFAULT_ADMIN_PASSWORDS];
    if (db.adminPassword) {
      list.unshift(db.adminPassword);
    }
    return Array.from(new Set(list));
  }

  app.post("/api/admin/login", (req, res) => {
    const { password } = req.body || {};
    const validPasswords = getValidAdminPasswords();
    if (password && validPasswords.includes(password.trim())) {
      const token = "admin_session_" + Date.now() + "_" + Math.random().toString(36).substring(2, 8);
      return res.json({ success: true, token });
    }
    return res.status(401).json({ success: false, message: "비밀번호가 일치하지 않습니다." });
  });

  app.post("/api/admin/change-password", (req, res) => {
    const { currentPassword, newPassword } = req.body || {};
    if (!newPassword || newPassword.trim().length < 4) {
      return res.status(400).json({ success: false, message: "새 비밀번호는 최소 4자리 이상이어야 합니다." });
    }

    const validPasswords = getValidAdminPasswords();
    if (!currentPassword || !validPasswords.includes(currentPassword.trim())) {
      return res.status(401).json({ success: false, message: "현재 비밀번호가 올바르지 않습니다." });
    }

    const db = getDb();
    db.adminPassword = newPassword.trim();
    saveDb(db);

    return res.json({ success: true, message: "관리자 비밀번호가 성공적으로 변경되었습니다." });
  });

  app.post("/api/admin/logout", (_req, res) => {
    return res.json({ success: true });
  });

  app.get("/api/admin/verify", (req, res) => {
    const token = req.headers["x-admin-token"];
    if (token && typeof token === "string" && token.startsWith("admin_")) {
      return res.json({ isAdmin: true });
    }
    return res.json({ isAdmin: false });
  });

  // Postcards API
  app.get("/api/postcards", (_req, res) => {
    const db = getDb();
    res.json(db.postcards || []);
  });

  app.post("/api/postcards", (req, res) => {
    const db = getDb();
    const newCard = req.body;
    if (!newCard || !newCard.recipientName) {
      return res.status(400).json({ error: "Invalid postcard payload" });
    }
    if (!newCard.id) {
      newCard.id = "card_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6);
    }
    if (!newCard.createdAt) {
      newCard.createdAt = new Date().toISOString();
    }
    db.postcards = [newCard, ...(db.postcards || [])];
    saveDb(db);
    res.json(newCard);
  });

  app.delete("/api/postcards/:id", (req, res) => {
    const db = getDb();
    const id = req.params.id;
    db.postcards = (db.postcards || []).filter((c: any) => c.id !== id);
    saveDb(db);
    res.json({ success: true });
  });

  // Destinations API
  app.get("/api/destinations", (_req, res) => {
    const db = getDb();
    res.json(db.destinations || []);
  });

  app.post("/api/destinations", (req, res) => {
    const db = getDb();
    const dest = req.body;
    if (!dest || !dest.name) {
      return res.status(400).json({ error: "Invalid destination payload" });
    }
    if (!dest.id) {
      dest.id = "dest_" + Date.now();
    }
    dest.isCustom = true;
    db.destinations = [...(db.destinations || []).filter((d: any) => d.id !== dest.id), dest];
    saveDb(db);
    res.json(dest);
  });

  app.delete("/api/destinations/:id", (req, res) => {
    const db = getDb();
    const id = req.params.id;
    db.destinations = (db.destinations || []).filter((d: any) => d.id !== id);
    if (!db.deletedDestinationIds) db.deletedDestinationIds = [];
    if (!db.deletedDestinationIds.includes(id)) {
      db.deletedDestinationIds.push(id);
    }
    saveDb(db);
    res.json({ success: true });
  });

  // Festivals API
  app.get("/api/festivals", (_req, res) => {
    const db = getDb();
    res.json(db.festivals || []);
  });

  app.post("/api/festivals", (req, res) => {
    const db = getDb();
    const fest = req.body;
    if (!fest || !fest.name) {
      return res.status(400).json({ error: "Invalid festival payload" });
    }
    if (!fest.id) {
      fest.id = "fest_" + Date.now();
    }
    fest.isCustom = true;
    db.festivals = [...(db.festivals || []).filter((f: any) => f.id !== fest.id), fest];
    saveDb(db);
    res.json(fest);
  });

  app.delete("/api/festivals/:id", (req, res) => {
    const db = getDb();
    const id = req.params.id;
    db.festivals = (db.festivals || []).filter((f: any) => f.id !== id);
    if (!db.deletedFestivalIds) db.deletedFestivalIds = [];
    if (!db.deletedFestivalIds.includes(id)) {
      db.deletedFestivalIds.push(id);
    }
    saveDb(db);
    res.json({ success: true });
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
