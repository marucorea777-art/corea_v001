import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { STATIC_TRANSLATIONS } from "../dataTranslations";
import { UI_DICTIONARY } from "../dictionaryData";

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
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

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
    const saved = localStorage.getItem("corea_labs_lang");
    return (saved as LanguageCode) || "en";
  });

  // Keep a persistent translation cache in state and localStorage
  const [translationCache, setTranslationCache] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(`corea_labs_cache_${language}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Update language and load its specific cache
  const setLanguage = (lang: LanguageCode) => {
    localStorage.setItem("corea_labs_lang", lang);
    setLanguageState(lang);
    try {
      const saved = localStorage.getItem(`corea_labs_cache_${lang}`);
      setTranslationCache(saved ? JSON.parse(saved) : {});
    } catch {
      setTranslationCache({});
    }
  };

  // Helper to detect if a string contains Korean characters (Hangul)
  const containsKorean = (text: string): boolean => {
    return /[\uac00-\ud7af]/u.test(text);
  };

  // Helper to resolve translation key
  const t = useCallback((key: string): string => {
    if (!key) return "";

    // If language is Korean and key is already Korean, return as-is
    if (language === "ko" && containsKorean(key)) {
      return key;
    }

    // Look up in comprehensive UI dictionary
    const dict = UI_DICTIONARY[language];
    if (dict && dict[key]) {
      return dict[key];
    }

    // Look up in custom static translations
    const staticDict = STATIC_TRANSLATIONS[language];
    if (staticDict && staticDict[key]) {
      return staticDict[key];
    }

    // Look up in runtime cache
    if (translationCache[key]) {
      return translationCache[key];
    }

    // If language is English and key is English (no Korean), return as-is
    if (language === "en" && !containsKorean(key)) {
      return key;
    }

    // Otherwise, return original key as fallback
    return key;
  }, [language, translationCache]);

  // Queue for batching translation requests to the server to prevent rate limiting
  const pendingRequestsRef = useRef<{
    text: string;
    resolve: (translated: string) => void;
    reject: (err: any) => void;
  }[]>([]);
  const batchTimerRef = useRef<NodeJS.Timeout | null>(null);
  const apiFallbackUntilRef = useRef<Record<string, number>>({});

  // Consolidated batch translation fetcher with debounce
  const queueTranslation = useCallback((text: string): Promise<string> => {
    // If rate limit backoff is active for this language, fallback to static t(text)
    if (apiFallbackUntilRef.current[language] && Date.now() < apiFallbackUntilRef.current[language]) {
      return Promise.resolve(t(text));
    }

    return new Promise<string>((resolve, reject) => {
      pendingRequestsRef.current.push({ text, resolve, reject });

      if (batchTimerRef.current) {
        clearTimeout(batchTimerRef.current);
      }

      batchTimerRef.current = setTimeout(async () => {
        batchTimerRef.current = null;
        const currentQueue = pendingRequestsRef.current;
        pendingRequestsRef.current = [];

        if (currentQueue.length === 0) return;

        // Extract unique texts to translate
        const uniqueTexts: string[] = Array.from(new Set(currentQueue.map(item => item.text))) as string[];
        const targetLangObj = LANGUAGES.find(l => l.code === language);
        const targetLanguageName = targetLangObj ? targetLangObj.name : "English";

        try {
          const response = await fetch("/api/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              texts: uniqueTexts,
              targetLanguage: targetLanguageName
            }),
          });

          if (!response.ok) {
            throw new Error("Translation request failed");
          }

          const data = await response.json();
          const translations: string[] = data.translations || [];
          const hasError = !!data.error;
          const quotaExceeded = !!data.quotaExceeded;

          if (quotaExceeded || hasError) {
            // Temporary 5-second backoff
            apiFallbackUntilRef.current[language] = Date.now() + 5000;
          }

          // Map unique text to its translation
          const translationMap: Record<string, string> = {};
          uniqueTexts.forEach((originalText, idx) => {
            translationMap[originalText] = translations[idx] || originalText;
          });

          // Update local cache in bulk
          const newCache = { ...translationCache };
          let cacheChanged = false;

          if (!hasError) {
            uniqueTexts.forEach(originalText => {
              const translatedText = translationMap[originalText];
              if (translatedText && translatedText !== originalText) {
                newCache[originalText] = translatedText;
                cacheChanged = true;
              }
            });
            if (cacheChanged) {
              setTranslationCache(newCache);
              localStorage.setItem(`corea_labs_cache_${language}`, JSON.stringify(newCache));
            }
          }

          // Resolve all pending items
          currentQueue.forEach(item => {
            item.resolve(translationMap[item.text] || item.text);
          });
        } catch (error) {
          console.warn("Batch translation fetch failed. Falling back to static dictionary.", error);
          // Set 5-second backoff
          apiFallbackUntilRef.current[language] = Date.now() + 5000;
          // Resolve with fallback
          currentQueue.forEach(item => {
            item.resolve(t(item.text));
          });
        }
      }, 120); // 120ms debounce window
    });
  }, [language, translationCache, t]);

  // Dynamic Single text translation helper (utilizes the debounced queue)
  const translateText = useCallback(async (text: string): Promise<string> => {
    if (!text || !text.trim()) return text;
    if (language === "ko" && containsKorean(text)) return text;
    if (language === "en" && !containsKorean(text)) return text;

    const staticRes = t(text);
    if (staticRes && staticRes !== text) return staticRes;

    return queueTranslation(text);
  }, [language, queueTranslation, t]);

  // Dynamic Batch translation helper (utilizes the debounced queue in parallel)
  const translateBatch = useCallback(async (texts: string[]): Promise<string[]> => {
    if (texts.length === 0) {
      return texts;
    }
    return Promise.all(texts.map(text => translateText(text)));
  }, [translateText]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translateText, translateBatch }}>
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

// Higher-order Component to dynamically translate texts
interface TranslateProps {
  children: string;
}

export function Translate({ children }: TranslateProps) {
  const { language, t, translateText } = useTranslation();
  const [translated, setTranslated] = useState<string>(() => t(children));
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const immediate = t(children);

    const containsKorean = (text: string): boolean => {
      return /[\uac00-\ud7af]/u.test(text);
    };

    const isTargetMatch = 
      immediate !== children || 
      (language === "ko" && containsKorean(children)) ||
      (language === "en" && !containsKorean(children));

    if (isTargetMatch) {
      setTranslated(immediate);
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);
    
    translateText(children).then(res => {
      if (isMounted) {
        setTranslated(res);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [children, language, t, translateText]);

  if (loading) {
    return (
      <span className="animate-pulse bg-stone-200/60 rounded text-transparent select-none inline-block px-1">
        {children}
      </span>
    );
  }

  return <>{translated}</>;
}

export function useTranslatedData<T>(
  originalData: T,
  keysToTranslate: string[]
): { translatedData: T; loading: boolean } {
  const { language, translateBatch } = useTranslation();
  const [translatedData, setTranslatedData] = useState<T>(originalData);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (language === "en" || !originalData) {
      setTranslatedData(originalData);
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    const dataArray = Array.isArray(originalData) ? originalData : [originalData];
    const textsToTranslate: string[] = [];
    const mapping: { itemIndex: number; key: string }[] = [];

    dataArray.forEach((item, itemIndex) => {
      keysToTranslate.forEach((key) => {
        if (item && item[key] && typeof item[key] === "string") {
          textsToTranslate.push(item[key]);
          mapping.push({ itemIndex, key });
        }
      });
    });

    if (textsToTranslate.length === 0) {
      setTranslatedData(originalData);
      setLoading(false);
      return;
    }

    translateBatch(textsToTranslate)
      .then((translations) => {
        if (!isMounted) return;

        const newArray = dataArray.map((item) => ({ ...item }));
        mapping.forEach((map, index) => {
          if (newArray[map.itemIndex]) {
            newArray[map.itemIndex][map.key] = translations[index];
          }
        });

        setTranslatedData(Array.isArray(originalData) ? (newArray as unknown as T) : (newArray[0] as unknown as T));
        setLoading(false);
      })
      .catch((err) => {
        console.warn("Translation failed for data, falling back to original", err);
        if (isMounted) {
          setTranslatedData(originalData);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [originalData, keysToTranslate, language, translateBatch]);

  return { translatedData, loading };
}
