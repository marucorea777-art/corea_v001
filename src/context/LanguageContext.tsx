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

const GTX_LANG_MAP: Record<LanguageCode, string> = {
  ko: "ko",
  en: "en",
  ja: "ja",
  zh: "zh-CN",
  th: "th",
  fr: "fr",
  es: "es",
  pt: "pt",
  ka: "ka",
  ru: "ru",
  uk: "uk",
};

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

// Build bidirectional reverse index between Korean strings and English canonical keys,
// plus a per-language set of already-translated target values so double-wrapped strings (<Translate> inside useTranslatedData) return in 0ms
const koreanToEnglishMap: Record<string, string> = {};
const englishToKoreanMap: Record<string, string> = {};
const knownTargetValuesByLang: Record<string, Set<string>> = {};

const populateReverseMap = (dict: Record<string, string> | undefined, lang?: string) => {
  if (!dict) return;
  const targetSet = lang ? (knownTargetValuesByLang[lang] || (knownTargetValuesByLang[lang] = new Set<string>())) : null;
  for (const [k, v] of Object.entries(dict)) {
    if (!k || !v || typeof v !== "string") continue;
    if (targetSet) {
      targetSet.add(v);
      targetSet.add(v.trim());
    }
    if (lang === "ko" || lang === "en" || !lang) {
      // Case 1: English key -> Korean value
      if (!containsKorean(k) && containsKorean(v)) {
        const trimmedKo = v.trim();
        const trimmedEn = k.trim();
        koreanToEnglishMap[trimmedKo] = k;
        koreanToEnglishMap[v] = k;
        englishToKoreanMap[trimmedEn] = v;
        englishToKoreanMap[k] = v;
      }
      // Case 2: Korean key -> English value
      if (containsKorean(k) && !containsKorean(v)) {
        const trimmedKo = k.trim();
        const trimmedEn = v.trim();
        koreanToEnglishMap[trimmedKo] = v;
        koreanToEnglishMap[k] = v;
        englishToKoreanMap[trimmedEn] = k;
        englishToKoreanMap[v] = k;
      }
    }
  }
};

for (const l of LANGUAGES) {
  populateReverseMap(UI_DICTIONARY?.[l.code], l.code);
  populateReverseMap(CARD_TRANSLATIONS?.[l.code], l.code);
  populateReverseMap(STATIC_TRANSLATIONS?.[l.code], l.code);
}

// Validate whether a candidate dictionary value is actually translated for targetLang
function isValidDictValue(key: string, val: string | undefined, targetLang: LanguageCode): val is string {
  if (!val || typeof val !== "string" || !val.trim()) return false;
  if (targetLang === "ko") {
    return containsKorean(val);
  }
  if (targetLang === "en") {
    return !containsKorean(val);
  }
  // For ja, zh, th, fr, es, pt, ka, ru, uk:
  // Reject if value still contains Korean characters
  if (containsKorean(val)) return false;
  return true;
}

async function translateViaBrowserMultiQ(texts: string[], targetLang: LanguageCode): Promise<(string | null)[]> {
  if (texts.length === 0) return [];
  const tl = GTX_LANG_MAP[targetLang] || targetLang;

  // Primary: clients5 multi-q batch endpoint
  try {
    const url = `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=auto&tl=${encodeURIComponent(tl)}`;
    const params = new URLSearchParams();
    for (const t of texts) {
      params.append("q", t);
    }
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length === texts.length) {
        return data.map((item: any) => {
          if (Array.isArray(item) && typeof item[0] === "string" && item[0].trim()) {
            return item[0].trim();
          }
          if (typeof item === "string" && item.trim()) {
            return item.trim();
          }
          return null;
        });
      }
    }
  } catch {
    // Fall through to single GTX endpoint
  }

  // Secondary fallback: translate.googleapis.com single requests
  return Promise.all(
    texts.map(async (text) => {
      try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${encodeURIComponent(tl)}&dt=t&q=${encodeURIComponent(text)}`;
        const res = await fetch(url);
        if (!res.ok) return null;
        const data = await res.json();
        if (Array.isArray(data) && Array.isArray(data[0])) {
          const joined = data[0]
            .map((part: any) => (Array.isArray(part) && typeof part[0] === "string" ? part[0] : ""))
            .join("");
          if (joined.trim()) {
            return joined.trim();
          }
        }
      } catch {
        // ignore
      }
      return null;
    })
  );
}

const CACHE_KEY_PREFIX = "corea_labs_cache_v4_";

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
      const saved = localStorage.getItem("corea_labs_lang") as LanguageCode | null;
      if (saved && LANGUAGES.some(l => l.code === saved)) {
        return saved;
      }
    } catch {
      // ignore
    }
    try {
      const browserLang = (navigator.language || "").slice(0, 2).toLowerCase() as LanguageCode;
      if (LANGUAGES.some(l => l.code === browserLang)) {
        return browserLang;
      }
    } catch {
      // ignore
    }
    return "en";
  });

  // Persistent translation cache for dynamic / custom strings
  const [translationCache, setTranslationCache] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(`${CACHE_KEY_PREFIX}${language}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [cacheVersion, setCacheVersion] = useState<number>(0);
  const languageRef = useRef<LanguageCode>(language);
  languageRef.current = language;

  // Switch language and load its persisted cache
  const setLanguage = useCallback((lang: LanguageCode) => {
    languageRef.current = lang;
    pendingQueueRef.current.clear();
    inFlightRef.current.clear();
    try {
      localStorage.setItem("corea_labs_lang", lang);
      const saved = localStorage.getItem(`${CACHE_KEY_PREFIX}${lang}`);
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
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Background processor: translates any dynamic / custom strings directly in the browser
  const processPendingBatch = useCallback(async () => {
    const activeLang = languageRef.current;
    const itemsToFetch: string[] = [];

    pendingQueueRef.current.forEach(text => {
      if (!inFlightRef.current.has(`${activeLang}:${text}`) && itemsToFetch.length < 40) {
        itemsToFetch.push(text);
        inFlightRef.current.add(`${activeLang}:${text}`);
        pendingQueueRef.current.delete(text);
      }
    });

    if (itemsToFetch.length === 0) return;

    const batchResults: Record<string, string> = {};
    const translatedList = await translateViaBrowserMultiQ(itemsToFetch, activeLang);

    itemsToFetch.forEach((orig, idx) => {
      const translated = translatedList[idx];
      if (translated && isValidDictValue(orig, translated, activeLang)) {
        batchResults[orig] = translated;
        knownTargetValuesByLang[activeLang]?.add(translated);
      } else {
        inFlightRef.current.delete(`${activeLang}:${orig}`);
      }
    });

    if (Object.keys(batchResults).length > 0 && languageRef.current === activeLang) {
      setTranslationCache(prev => {
        const next = { ...prev, ...batchResults };
        try {
          localStorage.setItem(`${CACHE_KEY_PREFIX}${activeLang}`, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
      setCacheVersion(v => v + 1);
    }

    if (pendingQueueRef.current.size > 0) {
      setTimeout(processPendingBatch, 100);
    }
  }, []);

  const queueBackgroundTranslation = useCallback((text: string) => {
    if (!text || text.trim().length <= 1) return;
    const activeLang = languageRef.current;
    if (activeLang === "ko" && containsKorean(text)) return;
    if (activeLang === "en" && !containsKorean(text)) return;
    if (knownTargetValuesByLang[activeLang]?.has(text) || knownTargetValuesByLang[activeLang]?.has(text.trim())) {
      return;
    }
    if (inFlightRef.current.has(`${activeLang}:${text}`)) return;
    if (translationCache[text]) return;

    pendingQueueRef.current.add(text);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      debounceTimerRef.current = null;
      processPendingBatch();
    }, 60);
  }, [translationCache, processPendingBatch]);

  // Instant dictionary translation lookup across all 11 languages
  const t = useCallback((key: string): string => {
    if (!key || typeof key !== "string") return "";
    const trimmed = key.trim();
    if (!trimmed) return key;

    // Fast path: if key is already a known translated string in the active target language, return it immediately
    if (knownTargetValuesByLang[language]?.has(key) || knownTargetValuesByLang[language]?.has(trimmed)) {
      return key;
    }

    // 1. Target language: Korean
    if (language === "ko") {
      if (containsKorean(key)) {
        return key;
      }
      if (isValidDictValue(key, CARD_TRANSLATIONS.ko?.[key], "ko")) return CARD_TRANSLATIONS.ko[key];
      if (isValidDictValue(trimmed, CARD_TRANSLATIONS.ko?.[trimmed], "ko")) return CARD_TRANSLATIONS.ko[trimmed];
      if (isValidDictValue(key, UI_DICTIONARY.ko?.[key], "ko")) return UI_DICTIONARY.ko[key];
      if (isValidDictValue(trimmed, UI_DICTIONARY.ko?.[trimmed], "ko")) return UI_DICTIONARY.ko[trimmed];
      if (isValidDictValue(key, STATIC_TRANSLATIONS.ko?.[key], "ko")) return STATIC_TRANSLATIONS.ko[key];
      if (isValidDictValue(trimmed, STATIC_TRANSLATIONS.ko?.[trimmed], "ko")) return STATIC_TRANSLATIONS.ko[trimmed];
      if (englishToKoreanMap[key]) return englishToKoreanMap[key];
      if (englishToKoreanMap[trimmed]) return englishToKoreanMap[trimmed];
      if (isValidDictValue(key, translationCache[key], "ko")) return translationCache[key];
      if (isValidDictValue(trimmed, translationCache[trimmed], "ko")) return translationCache[trimmed];
      queueBackgroundTranslation(key);
      return key;
    }

    // 2. Target language: English
    if (language === "en") {
      if (!containsKorean(key)) {
        if (isValidDictValue(key, CARD_TRANSLATIONS.en?.[key], "en")) return CARD_TRANSLATIONS.en[key];
        if (isValidDictValue(trimmed, CARD_TRANSLATIONS.en?.[trimmed], "en")) return CARD_TRANSLATIONS.en[trimmed];
        return key;
      }
      // Check English dictionaries directly (for Korean keys mapped to English)
      if (isValidDictValue(key, STATIC_TRANSLATIONS.en?.[key], "en")) return STATIC_TRANSLATIONS.en[key];
      if (isValidDictValue(trimmed, STATIC_TRANSLATIONS.en?.[trimmed], "en")) return STATIC_TRANSLATIONS.en[trimmed];
      if (isValidDictValue(key, UI_DICTIONARY.en?.[key], "en")) return UI_DICTIONARY.en[key];
      if (isValidDictValue(trimmed, UI_DICTIONARY.en?.[trimmed], "en")) return UI_DICTIONARY.en[trimmed];
      if (isValidDictValue(key, CARD_TRANSLATIONS.en?.[key], "en")) return CARD_TRANSLATIONS.en[key];
      if (isValidDictValue(trimmed, CARD_TRANSLATIONS.en?.[trimmed], "en")) return CARD_TRANSLATIONS.en[trimmed];

      const engFromKo = koreanToEnglishMap[key] || koreanToEnglishMap[trimmed];
      if (engFromKo) {
        return engFromKo;
      }
      if (isValidDictValue(key, translationCache[key], "en")) return translationCache[key];
      if (isValidDictValue(trimmed, translationCache[trimmed], "en")) return translationCache[trimmed];
      queueBackgroundTranslation(key);
      return key;
    }

    // 3. Any other target language (ja, zh, th, fr, es, pt, ka, ru, uk)
    const cardDict = CARD_TRANSLATIONS[language];
    if (cardDict) {
      if (isValidDictValue(key, cardDict[key], language)) return cardDict[key];
      if (isValidDictValue(trimmed, cardDict[trimmed], language)) return cardDict[trimmed];
    }

    const dict = UI_DICTIONARY[language];
    if (dict) {
      if (isValidDictValue(key, dict[key], language)) return dict[key];
      if (isValidDictValue(trimmed, dict[trimmed], language)) return dict[trimmed];
    }

    const staticDict = STATIC_TRANSLATIONS[language];
    if (staticDict) {
      if (isValidDictValue(key, staticDict[key], language)) return staticDict[key];
      if (isValidDictValue(trimmed, staticDict[trimmed], language)) return staticDict[trimmed];
    }

    // If source key is Korean, also check via canonical English key
    let engKey: string | undefined;
    if (containsKorean(key)) {
      engKey =
        STATIC_TRANSLATIONS.en?.[key] ||
        STATIC_TRANSLATIONS.en?.[trimmed] ||
        UI_DICTIONARY.en?.[key] ||
        UI_DICTIONARY.en?.[trimmed] ||
        koreanToEnglishMap[key] ||
        koreanToEnglishMap[trimmed];
      if (engKey) {
        const trimmedEng = engKey.trim();
        if (isValidDictValue(engKey, cardDict?.[engKey], language)) return cardDict![engKey];
        if (isValidDictValue(trimmedEng, cardDict?.[trimmedEng], language)) return cardDict![trimmedEng];
        if (isValidDictValue(engKey, dict?.[engKey], language)) return dict![engKey];
        if (isValidDictValue(trimmedEng, dict?.[trimmedEng], language)) return dict![trimmedEng];
        if (isValidDictValue(engKey, staticDict?.[engKey], language)) return staticDict![engKey];
        if (isValidDictValue(trimmedEng, staticDict?.[trimmedEng], language)) return staticDict![trimmedEng];
      }
    } else {
      // Source key is English: also check if the target dictionary indexed it under its Korean counterpart
      const koCounterpart =
        STATIC_TRANSLATIONS.ko?.[key] ||
        STATIC_TRANSLATIONS.ko?.[trimmed] ||
        UI_DICTIONARY.ko?.[key] ||
        UI_DICTIONARY.ko?.[trimmed] ||
        englishToKoreanMap[key] ||
        englishToKoreanMap[trimmed];
      if (koCounterpart) {
        const trimmedKo = koCounterpart.trim();
        if (isValidDictValue(koCounterpart, cardDict?.[koCounterpart], language)) return cardDict![koCounterpart];
        if (isValidDictValue(trimmedKo, cardDict?.[trimmedKo], language)) return cardDict![trimmedKo];
        if (isValidDictValue(koCounterpart, dict?.[koCounterpart], language)) return dict![koCounterpart];
        if (isValidDictValue(trimmedKo, dict?.[trimmedKo], language)) return dict![trimmedKo];
        if (isValidDictValue(koCounterpart, staticDict?.[koCounterpart], language)) return staticDict![koCounterpart];
        if (isValidDictValue(trimmedKo, staticDict?.[trimmedKo], language)) return staticDict![trimmedKo];
      }
    }

    // Dynamic cache check
    if (isValidDictValue(key, translationCache[key], language)) return translationCache[key];
    if (isValidDictValue(trimmed, translationCache[trimmed], language)) return translationCache[trimmed];
    if (engKey && isValidDictValue(engKey, translationCache[engKey], language)) return translationCache[engKey];

    // Queue for instant browser translation in background
    queueBackgroundTranslation(key);

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
    const translateValue = (val: any): any => {
      if (typeof val === "string") {
        return t(val);
      }
      if (Array.isArray(val)) {
        return val.map(item => {
          if (typeof item === "string") {
            return t(item);
          }
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
            if (language === "ko" && (k === "name" || k === "title") && item.koreanName) {
              copy[k] = item.koreanName;
            } else {
              copy[k] = translateValue(copy[k]);
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
            copy[k] = translateValue(copy[k]);
          }
        }
      }
      return copy as T;
    }

    return originalData;
  }, [originalData, keysKey, language, t, cacheVersion]);

  return { translatedData, loading: false };
}
