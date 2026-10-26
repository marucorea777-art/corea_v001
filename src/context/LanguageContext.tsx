import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from "react";
import { STATIC_TRANSLATIONS } from "../dataTranslations";
import { UI_DICTIONARY } from "../dictionaryData";
import { CARD_TRANSLATIONS } from "../cardTranslations";

export type LanguageCode = 
  | "ko" // Korean
  | "en" // English
  | "ja" // Japanese
  | "zh" // Chinese
  | "th" // Thai
  | "fr" // French
  | "es" // Spanish (Mexico)
  | "pt" // Portuguese (Brazil)
  | "ka" // Georgian
  | "ru" // Russian
  | "uk"; // Ukrainian

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
}

export const LANGUAGES: Language[] = [
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
  { code: "zh", name: "Chinese", nativeName: "简体中文", flag: "🇨🇳" },
  { code: "th", name: "Thai", nativeName: "ไทย", flag: "🇹🇭" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "es", name: "Spanish", nativeName: "Español (MX)", flag: "🇲🇽" },
  { code: "pt", name: "Portuguese", nativeName: "Português (BR)", flag: "🇧🇷" },
  { code: "ka", name: "Georgian", nativeName: "ქართული", flag: "🇬🇪" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺" },
  { code: "uk", name: "Ukrainian", nativeName: "Українська", flag: "🇺🇦" },
];

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
  translateText: (text: string) => Promise<string>;
  translateBatch: (texts: string[]) => Promise<string[]>;
  cacheVersion: number;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Helper to detect if a string contains Korean characters (Hangul)
const containsKorean = (text: string): boolean => {
  return /[\uac00-\ud7af]/u.test(text);
};

// Build bidirectional reverse index from Korean translations back to English canonical keys
const koreanToEnglishMap: Record<string, string> = {};

const populateReverseMap = (dict: Record<string, string> | undefined) => {
  if (!dict) return;
  for (const [engKey, koVal] of Object.entries(dict)) {
    if (koVal && typeof koVal === "string" && containsKorean(koVal)) {
      const trimmedVal = koVal.trim();
      koreanToEnglishMap[trimmedVal] = engKey;
      koreanToEnglishMap[koVal] = engKey;
    }
  }
};

if (UI_DICTIONARY && UI_DICTIONARY.ko) {
  populateReverseMap(UI_DICTIONARY.ko);
}
if (CARD_TRANSLATIONS && CARD_TRANSLATIONS.ko) {
  populateReverseMap(CARD_TRANSLATIONS.ko);
}
if (STATIC_TRANSLATIONS && STATIC_TRANSLATIONS.ko) {
  populateReverseMap(STATIC_TRANSLATIONS.ko);
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const urlLang = urlParams.get("lang") as LanguageCode | null;
      if (urlLang && LANGUAGES.some(l => l.code === urlLang)) {
        localStorage.setItem("corea_labs_lang", urlLang);
        return urlLang;
      }
    } catch {
      // ignore
    }
    try {
      const saved = localStorage.getItem("corea_labs_lang");
      return (saved as LanguageCode) || "en";
    } catch {
      return "en";
    }
  });

  // Persistent translation cache for dynamic / background AI translations
  const [translationCache, setTranslationCache] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(`corea_labs_cache_${language}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [cacheVersion, setCacheVersion] = useState<number>(0);

  // Switch language and load its persisted cache
  const setLanguage = useCallback((lang: LanguageCode) => {
    try {
      localStorage.setItem("corea_labs_lang", lang);
      const saved = localStorage.getItem(`corea_labs_cache_${lang}`);
      setTranslationCache(saved ? JSON.parse(saved) : {});
    } catch {
      setTranslationCache({});
    }
    setLanguageState(lang);
    setCacheVersion(v => v + 1);
  }, []);

  // Background non-blocking translation queue
  const pendingQueueRef = useRef<Set<string>>(new Set());
  const inFlightRef = useRef<Set<string>>(new Set());
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Background processor: sends batches to /api/translate quietly without blocking UI
  const processPendingBatch = useCallback(() => {
    if (language === "en") return;
    const itemsToFetch: string[] = [];

    pendingQueueRef.current.forEach(text => {
      if (!inFlightRef.current.has(text) && itemsToFetch.length < 35) {
        itemsToFetch.push(text);
        inFlightRef.current.add(text);
        pendingQueueRef.current.delete(text);
      }
    });

    if (itemsToFetch.length === 0) return;

    const targetLangObj = LANGUAGES.find(l => l.code === language);
    const targetLanguageName = targetLangObj ? targetLangObj.name : "English";

    fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        texts: itemsToFetch,
        targetLanguage: targetLanguageName
      }),
    })
      .then(res => res.json())
      .then(data => {
        const translations: string[] = data.translations || [];
        let updatedCount = 0;
        const newCache = { ...translationCache };

        itemsToFetch.forEach((orig, idx) => {
          const trans = translations[idx];
          if (trans && trans !== orig) {
            newCache[orig] = trans;
            updatedCount++;
          }
        });

        if (updatedCount > 0) {
          setTranslationCache(newCache);
          try {
            localStorage.setItem(`corea_labs_cache_${language}`, JSON.stringify(newCache));
          } catch {
            // ignore
          }
          setCacheVersion(v => v + 1);
        }
      })
      .catch(err => {
        console.warn("Background AI translation error:", err);
      })
      .finally(() => {
        // If there are more items, process next batch after a gentle pause
        if (pendingQueueRef.current.size > 0) {
          setTimeout(processPendingBatch, 600);
        }
      });
  }, [language, translationCache]);

  const queueBackgroundTranslation = useCallback((text: string) => {
    if (!text || text.trim().length <= 1) return;
    if (language === "en" || inFlightRef.current.has(text)) return;
    if (translationCache[text]) return;

    pendingQueueRef.current.add(text);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      debounceTimerRef.current = null;
      processPendingBatch();
    }, 350);
  }, [language, translationCache, processPendingBatch]);

  // Instant dictionary translation lookup
  const t = useCallback((key: string): string => {
    if (!key || typeof key !== "string") return "";
    const trimmed = key.trim();
    if (!trimmed) return key;

    // 1. Target language: Korean
    if (language === "ko") {
      if (containsKorean(key)) {
        return key;
      }
      // Source key is in English or non-Korean: look up Korean dictionary
      if (CARD_TRANSLATIONS.ko?.[key]) return CARD_TRANSLATIONS.ko[key];
      if (CARD_TRANSLATIONS.ko?.[trimmed]) return CARD_TRANSLATIONS.ko[trimmed];
      if (UI_DICTIONARY.ko?.[key]) return UI_DICTIONARY.ko[key];
      if (UI_DICTIONARY.ko?.[trimmed]) return UI_DICTIONARY.ko[trimmed];
      if (STATIC_TRANSLATIONS.ko?.[key]) return STATIC_TRANSLATIONS.ko[key];
      if (STATIC_TRANSLATIONS.ko?.[trimmed]) return STATIC_TRANSLATIONS.ko[trimmed];
      if (translationCache[key]) return translationCache[key];
      if (translationCache[trimmed]) return translationCache[trimmed];
      queueBackgroundTranslation(key);
      return key;
    }

    // 2. Target language: English
    if (language === "en") {
      if (!containsKorean(key)) {
        if (CARD_TRANSLATIONS.en?.[key]) return CARD_TRANSLATIONS.en[key];
        if (CARD_TRANSLATIONS.en?.[trimmed]) return CARD_TRANSLATIONS.en[trimmed];
        return key;
      }
      // Source key is Korean: translate back to English via reverse map
      const engFromKo = koreanToEnglishMap[key] || koreanToEnglishMap[trimmed];
      if (engFromKo) {
        return engFromKo;
      }
      if (translationCache[key]) return translationCache[key];
      if (translationCache[trimmed]) return translationCache[trimmed];
      queueBackgroundTranslation(key);
      return key;
    }

    // 3. Any other target language (ja, zh, th, fr, es, pt, ka, ru, uk)
    const cardDict = CARD_TRANSLATIONS[language];
    if (cardDict) {
      if (cardDict[key]) return cardDict[key];
      if (cardDict[trimmed]) return cardDict[trimmed];
    }

    const dict = UI_DICTIONARY[language];
    if (dict) {
      if (dict[key]) return dict[key];
      if (dict[trimmed]) return dict[trimmed];
    }

    const staticDict = STATIC_TRANSLATIONS[language];
    if (staticDict) {
      if (staticDict[key]) return staticDict[key];
      if (staticDict[trimmed]) return staticDict[trimmed];
    }

    // If source key is Korean, find its canonical English key and look that up in the target language dictionary
    let engKey: string | undefined;
    if (containsKorean(key)) {
      engKey = koreanToEnglishMap[key] || koreanToEnglishMap[trimmed];
      if (engKey) {
        if (cardDict?.[engKey]) return cardDict[engKey];
        if (cardDict?.[engKey.trim()]) return cardDict[engKey.trim()];
        if (dict?.[engKey]) return dict[engKey];
        if (dict?.[engKey.trim()]) return dict[engKey.trim()];
        if (staticDict?.[engKey]) return staticDict[engKey];
        if (staticDict?.[engKey.trim()]) return staticDict[engKey.trim()];
      }
    }

    // Dynamic cache check
    if (translationCache[key]) return translationCache[key];
    if (translationCache[trimmed]) return translationCache[trimmed];
    if (engKey && translationCache[engKey]) return translationCache[engKey];

    // Queue for AI translation in background if available
    queueBackgroundTranslation(engKey || key);

    // Fallback: return English key if found instead of raw Korean to avoid alien characters
    return engKey || key;
  }, [language, translationCache, queueBackgroundTranslation]);

  // Dynamic single text translation helper
  const translateText = useCallback(async (text: string): Promise<string> => {
    if (!text || !text.trim()) return text;

    const staticRes = t(text);
    if (staticRes && staticRes !== text) return staticRes;

    if (language === "ko" && containsKorean(text)) return text;
    if (language === "en" && !containsKorean(text)) return text;

    if (translationCache[text]) return translationCache[text];

    return text;
  }, [language, t, translationCache]);

  // Batch translation helper
  const translateBatch = useCallback(async (texts: string[]): Promise<string[]> => {
    if (!texts || texts.length === 0) return [];
    return texts.map(text => t(text));
  }, [t]);

  const contextValue = useMemo(() => ({
    language,
    setLanguage,
    t,
    translateText,
    translateBatch,
    cacheVersion,
  }), [language, setLanguage, t, translateText, translateBatch, cacheVersion]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
}

// Pure, instantaneous translation component (0ms overhead, no loading flickers)
interface TranslateProps {
  children: string;
}

export function Translate({ children }: TranslateProps) {
  const { t } = useTranslation();
  if (typeof children !== "string") {
    return <>{children}</>;
  }
  return <>{t(children)}</>;
}

// High-performance data translation hook with deep object & array translation
export function useTranslatedData<T>(
  originalData: T,
  keysToTranslate: string[]
): { translatedData: T; loading: boolean } {
  const { language, t, cacheVersion } = useTranslation();
  const keysKey = keysToTranslate.join(",");

  const translatedData = useMemo(() => {
    if (!originalData) return originalData;

    // Helper to translate strings, string arrays, or nested objects
    const translateValue = (val: any, fieldKey?: string): any => {
      if (typeof val === "string") {
        return t(val);
      }
      if (Array.isArray(val)) {
        return val.map(item => {
          if (typeof item === "string") {
            return t(item);
          }
          // Array of objects (like attractions [{ name, desc }], itinerary [{ activity, desc }])
          if (item && typeof item === "object") {
            const translatedSub: any = { ...item };
            for (const subKey of Object.keys(translatedSub)) {
              if (typeof translatedSub[subKey] === "string") {
                translatedSub[subKey] = t(translatedSub[subKey]);
              }
            }
            return translatedSub;
          }
          return item;
        });
      }
      // Nested objects (like travelTips: { bestTime, mustTry, hiddenGem })
      if (val && typeof val === "object") {
        const translatedObj: any = { ...val };
        for (const subKey of Object.keys(translatedObj)) {
          if (typeof translatedObj[subKey] === "string") {
            translatedObj[subKey] = t(translatedObj[subKey]);
          }
        }
        return translatedObj;
      }
      return val;
    };

    const keys = keysKey.split(",");

    if (Array.isArray(originalData)) {
      return originalData.map((item) => {
        if (!item || typeof item !== "object") return item;
        const copy: any = { ...item };

        for (const k of keys) {
          if (k in copy && copy[k] !== undefined) {
            // When target language is Korean and item has koreanName, prefer it for name/title
            if (language === "ko" && (k === "name" || k === "title") && item.koreanName) {
              copy[k] = item.koreanName;
            } else {
              copy[k] = translateValue(copy[k], k);
            }
          }
        }
        return copy;
      }) as unknown as T;
    } else if (typeof originalData === "object") {
      const copy: any = { ...(originalData as any) };
      for (const k of keys) {
        if (k in copy && copy[k] !== undefined) {
          if (language === "ko" && (k === "name" || k === "title") && (originalData as any).koreanName) {
            copy[k] = (originalData as any).koreanName;
          } else {
            copy[k] = translateValue(copy[k], k);
          }
        }
      }
      return copy as T;
    }

    return originalData;
  }, [originalData, keysKey, language, t, cacheVersion]);

  return { translatedData, loading: false };
}
