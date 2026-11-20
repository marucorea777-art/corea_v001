export interface VisitorSummary {
  totalVisits: number;
  uniqueVisitors: number;
  todayVisits: number;
  intlRatio: number;
  avgDuration: string;
  onlineNow: number;
  isPureRealOnly?: boolean;
  trackingMode?: "real" | "zero" | "seed";
  cloudSynced?: boolean;
  cloudTotal?: number;
  detailedSessionsCount?: number;
}

export interface CountryStat {
  code: string;
  name: string;
  flag: string;
  count: number;
  percentage: number;
}

export interface LanguageStat {
  code: string;
  name: string;
  count: number;
  percentage: number;
}

export interface PageStat {
  path: string;
  name: string;
  count: number;
  percentage: number;
}

export interface DeviceStat {
  name: string;
  count: number;
  percentage: number;
}

export interface ReferrerStat {
  name: string;
  count: number;
  percentage: number;
}

export interface DailyTrendItem {
  date: string;
  count: number;
}

export interface RecentVisitorItem {
  id: string;
  sessionId?: string;
  timestamp: string;
  country: string;
  flag: string;
  code: string;
  path: string;
  device: string;
  language: string;
  referrer?: string;
  staySeconds?: number;
}

export interface AnalyticsStatsResponse {
  summary: VisitorSummary;
  countries: CountryStat[];
  languages: LanguageStat[];
  pages: PageStat[];
  devices: DeviceStat[];
  referrers: ReferrerStat[];
  dailyTrend: DailyTrendItem[];
  recentVisitors: RecentVisitorItem[];
}

interface PersistentAnalyticsLedger {
  trackingMode?: "real" | "zero" | "seed";
  isPureRealOnly: boolean;
  totalVisits: number;
  localVisitsCount?: number;
  uniqueVisitorsCount: number;
  uniqueSessionIds: Record<string, boolean>;
  activeSessions: Record<string, number>;
  sessionDurations: Record<string, number>;
  todayDate: string;
  dailyStats: Record<string, number>;
  countryStats: Record<string, { code: string; name: string; flag: string; count: number }>;
  languageStats: Record<string, { code: string; name: string; count: number }>;
  pageStats: Record<string, { path: string; name: string; count: number }>;
  deviceStats: Record<string, { name: string; count: number }>;
  referrerStats: Record<string, { name: string; count: number }>;
  recentVisitors: RecentVisitorItem[];
  lastUpdated: number;
  lastSyncedCloudTotal?: number;
}

// Bumped storage keys to v4/v7 so stale synthetic v3 campaign caches are discarded automatically
const LEDGER_STORAGE_KEY = "corea_labs_realtime_ledger_v4";
const ANALYTICS_CACHE_KEY = "corea_labs_analytics_cache_v4";
const ANALYTICS_MODE_KEY = "corea_labs_analytics_mode_v4";
const CLOUD_COUNT_CACHE_KEY = "corea_labs_abacus_cloud_count_v7";
const CLOUD_DAILY_MAP_KEY = "corea_labs_abacus_daily_map_v7";
const SESSION_ELAPSED_KEY = "corea_labs_session_elapsed_sec_v4";

const BROADCAST_CHANNEL_NAME = "corea_labs_analytics_channel_v4";
const ABACUS_CLOUD_BASE = "https://abacus.jasoncameron.dev";
const ABACUS_NAMESPACE = "corea-labs.com";
const REAL_CLOUD_DAILY_START_DATE = "2026-11-17";
const ACTIVE_SESSION_WINDOW_MS = 5 * 60 * 1000; // 5 minutes active window for live online count

const TIMEZONE_TO_COUNTRY: Record<string, { code: string; name: string; flag: string }> = {
  "Asia/Seoul": { code: "KR", name: "South Korea", flag: "🇰🇷" },
  "Asia/Tokyo": { code: "JP", name: "Japan", flag: "🇯🇵" },
  "Asia/Shanghai": { code: "CN", name: "China", flag: "🇨🇳" },
  "Asia/Chongqing": { code: "CN", name: "China", flag: "🇨🇳" },
  "Asia/Hong_Kong": { code: "HK", name: "Hong Kong", flag: "🇭🇰" },
  "Asia/Taipei": { code: "TW", name: "Taiwan", flag: "🇹🇼" },
  "Asia/Bangkok": { code: "TH", name: "Thailand", flag: "🇹🇭" },
  "Asia/Singapore": { code: "SG", name: "Singapore", flag: "🇸🇬" },
  "Asia/Kolkata": { code: "IN", name: "India", flag: "🇮🇳" },
  "Asia/Dubai": { code: "AE", name: "United Arab Emirates", flag: "🇦🇪" },
  "Asia/Tbilisi": { code: "GE", name: "Georgia", flag: "🇬🇪" },
  "America/New_York": { code: "US", name: "United States", flag: "🇺🇸" },
  "America/Los_Angeles": { code: "US", name: "United States", flag: "🇺🇸" },
  "America/Chicago": { code: "US", name: "United States", flag: "🇺🇸" },
  "America/Denver": { code: "US", name: "United States", flag: "🇺🇸" },
  "America/Phoenix": { code: "US", name: "United States", flag: "🇺🇸" },
  "America/Toronto": { code: "CA", name: "Canada", flag: "🇨🇦" },
  "America/Vancouver": { code: "CA", name: "Canada", flag: "🇨🇦" },
  "America/Sao_Paulo": { code: "BR", name: "Brazil", flag: "🇧🇷" },
  "Europe/London": { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  "Europe/Paris": { code: "FR", name: "France", flag: "🇫🇷" },
  "Europe/Berlin": { code: "DE", name: "Germany", flag: "🇩🇪" },
  "Europe/Rome": { code: "IT", name: "Italy", flag: "🇮🇹" },
  "Europe/Madrid": { code: "ES", name: "Spain", flag: "🇪🇸" },
  "Europe/Lisbon": { code: "PT", name: "Portugal", flag: "🇵🇹" },
  "Europe/Amsterdam": { code: "NL", name: "Netherlands", flag: "🇳🇱" },
  "Europe/Moscow": { code: "RU", name: "Russia", flag: "🇷🇺" },
  "Europe/Kyiv": { code: "UA", name: "Ukraine", flag: "🇺🇦" },
  "Europe/Kiev": { code: "UA", name: "Ukraine", flag: "🇺🇦" },
  "Australia/Sydney": { code: "AU", name: "Australia", flag: "🇦🇺" },
  "Australia/Melbourne": { code: "AU", name: "Australia", flag: "🇦🇺" },
};

const LANGUAGE_LABELS: Record<string, string> = {
  en: "English (영어)",
  ko: "Korean (한국어)",
  ja: "Japanese (일본어)",
  zh: "Chinese (중국어)",
  th: "Thai (태국어)",
  fr: "French (프랑스어)",
  es: "Spanish (스페인어)",
  pt: "Portuguese (포르투갈어)",
  ka: "Georgian (조지아어)",
  ru: "Russian (러시아어)",
  uk: "Ukrainian (우크라이나어)",
};

const PAGE_LABELS: Record<string, string> = {
  home: "홈 & 코리아 랩스 (Home)",
  heritage: "왕실 문화유산 (Heritage)",
  culture: "전통 문화 (Culture)",
  places: "추천 명소 (Places)",
  festivals: "전국 축제 (Festivals)",
  travel: "입국 & 환전 가이드 (Travel Guide)",
  qna: "글로벌 여행 Q&A (Q&A)",
  privacy: "개인정보처리방침 (Privacy Policy)",
  terms: "이용약관 (Terms of Service)",
  about: "사이트 소개 (About Corea Labs)",
};

const DEVICE_LABELS: Record<string, string> = {
  mobile: "모바일 (Mobile)",
  desktop: "데스크톱 (Desktop)",
  tablet: "태블릿 (Tablet)",
};

export function getKstDateString(date: Date = new Date()): string {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  } catch {
    return new Date(date.getTime() + 9 * 60 * 60 * 1000).toISOString().split("T")[0];
  }
}

function getDatesLastNDays(n: number = 14): string[] {
  const dates: string[] = [];
  const base = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(base.getTime() - i * 86400000);
    dates.push(getKstDateString(d));
  }
  return dates;
}

function resolveCountry(timezone: string, language: string): { code: string; name: string; flag: string } {
  if (timezone && TIMEZONE_TO_COUNTRY[timezone]) {
    return TIMEZONE_TO_COUNTRY[timezone];
  }
  if (timezone?.startsWith("Asia/Seoul")) return { code: "KR", name: "South Korea", flag: "🇰🇷" };
  if (timezone?.startsWith("Asia/Tokyo")) return { code: "JP", name: "Japan", flag: "🇯🇵" };
  if (timezone?.startsWith("Europe/")) return { code: "FR", name: "France", flag: "🇫🇷" };
  if (timezone?.startsWith("America/")) return { code: "US", name: "United States", flag: "🇺🇸" };
  if (language === "ko") return { code: "KR", name: "South Korea", flag: "🇰🇷" };
  if (language === "ja") return { code: "JP", name: "Japan", flag: "🇯🇵" };
  if (language === "zh") return { code: "CN", name: "China", flag: "🇨🇳" };
  if (language === "th") return { code: "TH", name: "Thailand", flag: "🇹🇭" };
  if (language === "fr") return { code: "FR", name: "France", flag: "🇫🇷" };
  if (language === "es") return { code: "ES", name: "Spain", flag: "🇪🇸" };
  if (language === "pt") return { code: "PT", name: "Portugal", flag: "🇵🇹" };
  if (language === "ka") return { code: "GE", name: "Georgia", flag: "🇬🇪" };
  if (language === "ru") return { code: "RU", name: "Russia", flag: "🇷🇺" };
  if (language === "uk") return { code: "UA", name: "Ukraine", flag: "🇺🇦" };
  return { code: "US", name: "United States", flag: "🇺🇸" };
}

export function formatDurationSeconds(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) return "0m 00s";
  const rounded = Math.round(totalSeconds);
  const mins = Math.floor(rounded / 60);
  const secs = rounded % 60;
  return `${mins}m ${secs.toString().padStart(2, "0")}s`;
}

export function createEmptyRealLedger(mode: "real" | "zero" = "real"): PersistentAnalyticsLedger {
  const today = getKstDateString();
  const dates = getDatesLastNDays(14);
  const dailyStats: Record<string, number> = {};
  dates.forEach((d) => {
    dailyStats[d] = 0;
  });

  return {
    trackingMode: mode,
    isPureRealOnly: true,
    totalVisits: 0,
    localVisitsCount: 0,
    uniqueVisitorsCount: 0,
    uniqueSessionIds: {},
    activeSessions: {},
    sessionDurations: {},
    todayDate: today,
    dailyStats,
    countryStats: {},
    languageStats: {},
    pageStats: {},
    deviceStats: {},
    referrerStats: {},
    recentVisitors: [],
    lastUpdated: Date.now(),
  };
}

export function createZeroLedger(): PersistentAnalyticsLedger {
  return createEmptyRealLedger("zero");
}

// Explicit Demo Preview Only (never used by default)
export function createSeedLedger(): PersistentAnalyticsLedger {
  const today = getKstDateString();
  const dates = getDatesLastNDays(14);
  const dailyStats: Record<string, number> = {};
  const baseCounts = [310, 335, 360, 380, 410, 395, 420, 385, 412, 398, 445, 480, 520, 433];
  dates.forEach((dateStr, idx) => {
    dailyStats[dateStr] = baseCounts[idx] || 400;
  });

  return {
    trackingMode: "seed",
    isPureRealOnly: false,
    totalVisits: 14821,
    localVisitsCount: 14821,
    uniqueVisitorsCount: 11291,
    uniqueSessionIds: { sess_demo_preview: true },
    activeSessions: {
      demo_1: Date.now() - 25000,
      demo_2: Date.now() - 60000,
      demo_3: Date.now() - 95000,
    },
    sessionDurations: {
      demo_1: 258,
      demo_2: 240,
      demo_3: 276,
    },
    todayDate: today,
    dailyStats,
    countryStats: {
      US: { code: "US", name: "United States", flag: "🇺🇸", count: 4821 },
      JP: { code: "JP", name: "Japan", flag: "🇯🇵", count: 2750 },
      CN: { code: "CN", name: "China", flag: "🇨🇳", count: 2120 },
      TW: { code: "TW", name: "Taiwan", flag: "🇹🇼", count: 1180 },
      GB: { code: "GB", name: "United Kingdom", flag: "🇬🇧", count: 950 },
      FR: { code: "FR", name: "France", flag: "🇫🇷", count: 720 },
      DE: { code: "DE", name: "Germany", flag: "🇩🇪", count: 640 },
      TH: { code: "TH", name: "Thailand", flag: "🇹🇭", count: 590 },
      AU: { code: "AU", name: "Australia", flag: "🇦🇺", count: 530 },
      CA: { code: "CA", name: "Canada", flag: "🇨🇦", count: 420 },
      KR: { code: "KR", name: "South Korea", flag: "🇰🇷", count: 390 },
      ES: { code: "ES", name: "Spain", flag: "🇪🇸", count: 280 },
      SG: { code: "SG", name: "Singapore", flag: "🇸🇬", count: 240 },
      OTHER: { code: "OTHER", name: "Other Countries", flag: "🌐", count: 190 },
    },
    languageStats: {
      en: { code: "en", name: "English (영어)", count: 8451 },
      ja: { code: "ja", name: "Japanese (일본어)", count: 2420 },
      zh: { code: "zh", name: "Chinese (중국어)", count: 1980 },
      ko: { code: "ko", name: "Korean (한국어)", count: 680 },
      th: { code: "th", name: "Thai (태국어)", count: 420 },
      fr: { code: "fr", name: "French (프랑스어)", count: 310 },
      es: { code: "es", name: "Spanish (스페인어)", count: 260 },
      ru: { code: "ru", name: "Russian (러시아어)", count: 150 },
      other: { code: "other", name: "Others (기타 언어)", count: 150 },
    },
    pageStats: {
      festivals: { path: "festivals", name: "전국 축제 (Festivals)", count: 6241 },
      travel: { path: "travel", name: "입국 & 환전 가이드 (Travel Guide)", count: 3710 },
      places: { path: "places", name: "추천 명소 (Places)", count: 2460 },
      heritage: { path: "heritage", name: "왕실 문화유산 (Heritage)", count: 1380 },
      culture: { path: "culture", name: "전통 문화 (Culture)", count: 620 },
      home: { path: "home", name: "홈 & 코리아 랩스 (Home)", count: 410 },
    },
    deviceStats: {
      mobile: { name: "모바일 (Mobile)", count: 10079 },
      desktop: { name: "데스크톱 (Desktop)", count: 4150 },
      tablet: { name: "태블릿 (Tablet)", count: 592 },
    },
    referrerStats: {
      "Google Search": { name: "Google / 글로벌 검색 (자연 유입)", count: 5624 },
      "Direct / corea-labs.com": { name: "직접 접속 (Direct / 북마크)", count: 3253 },
      "WhatsApp": { name: "WhatsApp 글로벌 메신저 공유", count: 1975 },
      "Reddit (r/koreatravel)": { name: "Reddit (r/koreatravel 커뮤니티)", count: 1534 },
      "AI Search (ChatGPT / Perplexity)": { name: "AI 검색 추천 (ChatGPT·Perplexity)", count: 1102 },
      "X (Twitter)": { name: "X (트위터) 글로벌 여행 추천", count: 740 },
      "LINE / Others": { name: "LINE 메신저 (일본·대만·태국)", count: 593 },
    },
    recentVisitors: [
      { id: "v_demo_1", timestamp: new Date(Date.now() - 1000 * 45).toISOString(), country: "United States", flag: "🇺🇸", code: "US", path: "festivals", device: "mobile", language: "en", referrer: "Google / 글로벌 검색 (자연 유입)" },
      { id: "v_demo_2", timestamp: new Date(Date.now() - 1000 * 120).toISOString(), country: "Japan", flag: "🇯🇵", code: "JP", path: "places", device: "desktop", language: "ja", referrer: "X (트위터) 글로벌 여행 추천" },
      { id: "v_demo_3", timestamp: new Date(Date.now() - 1000 * 240).toISOString(), country: "France", flag: "🇫🇷", code: "FR", path: "travel", device: "mobile", language: "fr", referrer: "AI 검색 추천 (ChatGPT·Perplexity)" },
    ],
    lastUpdated: Date.now(),
  };
}

export function computeStatsFromLedger(an: PersistentAnalyticsLedger): AnalyticsStatsResponse {
  const mode: "real" | "zero" | "seed" =
    an.trackingMode === "seed" ? "seed" : an.trackingMode === "zero" ? "zero" : "real";
  const isPureReal = mode !== "seed";
  const total = an.totalVisits || 0;
  const today = getKstDateString();
  const todayVisits = an.dailyStats?.[today] ?? 0;

  // Use sum of actually recorded demographic entries as denominator so percentages always sum coherently to 100%
  const countryEntries = Object.values(an.countryStats || {});
  const countryDenom = countryEntries.reduce((acc, c) => acc + (c.count || 0), 0);
  const countryList: CountryStat[] = countryEntries
    .map((c) => ({
      ...c,
      percentage: countryDenom > 0 ? Number(((c.count / countryDenom) * 100).toFixed(1)) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  const krCount = an.countryStats?.["KR"]?.count || 0;
  const intlCount = Math.max(0, countryDenom - krCount);
  const intlRatio = countryDenom > 0 ? Number(((intlCount / countryDenom) * 100).toFixed(1)) : 0;

  const langEntries = Object.values(an.languageStats || {});
  const langDenom = langEntries.reduce((acc, l) => acc + (l.count || 0), 0);
  const languageList: LanguageStat[] = langEntries
    .map((l) => ({
      code: l.code,
      name: LANGUAGE_LABELS[l.code] || l.name || l.code,
      count: l.count,
      percentage: langDenom > 0 ? Number(((l.count / langDenom) * 100).toFixed(1)) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  const pageEntries = Object.values(an.pageStats || {});
  const pageDenom = pageEntries.reduce((acc, p) => acc + (p.count || 0), 0);
  const pageList: PageStat[] = pageEntries
    .map((p) => ({
      path: p.path,
      name: PAGE_LABELS[p.path] || p.name || p.path,
      count: p.count,
      percentage: pageDenom > 0 ? Number(((p.count / pageDenom) * 100).toFixed(1)) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  const deviceValues = Object.values(an.deviceStats || {});
  const deviceTotal = deviceValues.reduce((acc, d) => acc + (d.count || 0), 0);
  const deviceList: DeviceStat[] = deviceValues
    .map((d) => ({
      name: DEVICE_LABELS[d.name] || d.name,
      count: d.count,
      percentage: deviceTotal > 0 ? Number(((d.count / deviceTotal) * 100).toFixed(1)) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  const last14Dates = getDatesLastNDays(14);
  const dailyTrend: DailyTrendItem[] = last14Dates.map((date) => ({
    date,
    count: an.dailyStats?.[date] || 0,
  }));

  const referrerValues = Object.values(an.referrerStats || {});
  const referrerTotal = referrerValues.reduce((acc, r) => acc + (r.count || 0), 0);
  const referrerList: ReferrerStat[] = referrerValues
    .map((r) => ({
      name: r.name,
      count: r.count,
      percentage: referrerTotal > 0 ? Number(((r.count / referrerTotal) * 100).toFixed(1)) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  const uniqueKeysCount = Object.keys(an.uniqueSessionIds || {}).length;
  const uniqueVisitors =
    mode === "seed"
      ? an.uniqueVisitorsCount
      : Math.max(an.uniqueVisitorsCount || 0, uniqueKeysCount);

  // Compute live online visitors strictly from real activeSessions within last 5 minutes
  const now = Date.now();
  const cutoff = now - ACTIVE_SESSION_WINDOW_MS;
  const activeSessionIds = Object.entries(an.activeSessions || {}).filter(
    ([, lastSeen]) => typeof lastSeen === "number" && lastSeen >= cutoff
  );

  let rawOnline = activeSessionIds.length;
  if (rawOnline === 0 && (an.recentVisitors || []).length > 0) {
    // Fallback strictly from real recent visitor timestamps within 5 minutes
    const recentSessionSet = new Set<string>();
    (an.recentVisitors || []).forEach((v) => {
      const t = new Date(v.timestamp).getTime();
      if (!isNaN(t) && t >= cutoff) {
        recentSessionSet.add(v.sessionId || v.id);
      }
    });
    rawOnline = recentSessionSet.size;
  }

  // Strict consistency invariant: If today's visits is 0 in real mode, onlineNow cannot exceed 0
  const onlineNow = isPureReal ? (todayVisits <= 0 ? 0 : rawOnline) : rawOnline;

  // Compute average dwell time strictly from real measured session durations
  const durations = Object.values(an.sessionDurations || {}).filter(
    (s) => typeof s === "number" && s > 0
  );
  const avgDurationSeconds =
    durations.length > 0
      ? durations.reduce((sum, sec) => sum + sec, 0) / durations.length
      : 0;
  const avgDuration = formatDurationSeconds(avgDurationSeconds);

  return {
    summary: {
      totalVisits: total,
      uniqueVisitors,
      todayVisits,
      intlRatio,
      avgDuration,
      onlineNow,
      isPureRealOnly: isPureReal,
      trackingMode: mode,
      cloudSynced: mode === "real",
      cloudTotal: getCachedCloudCount(),
      detailedSessionsCount: uniqueKeysCount,
    },
    countries: countryList,
    languages: languageList,
    pages: pageList,
    devices: deviceList,
    referrers: referrerList,
    dailyTrend,
    recentVisitors: an.recentVisitors || [],
  };
}

function getCachedCloudCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(CLOUD_COUNT_CACHE_KEY);
    if (raw !== null) {
      const parsed = parseInt(raw, 10);
      if (!isNaN(parsed) && parsed >= 0) return parsed;
    }
  } catch {}
  return 0;
}

function setCachedCloudCount(val: number): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CLOUD_COUNT_CACHE_KEY, String(Math.max(0, val)));
  } catch {}
}

function getCachedCloudDailyMap(): Record<string, number> {
  const today = getKstDateString();
  if (typeof window === "undefined") return { [today]: 0 };
  try {
    const raw = localStorage.getItem(CLOUD_DAILY_MAP_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Record<string, number>;
      if (parsed && typeof parsed === "object") {
        return parsed;
      }
    }
  } catch {}
  return { [today]: 0 };
}

function setCachedCloudDailyValue(dateStr: string, val: number): void {
  if (typeof window === "undefined") return;
  try {
    const map = getCachedCloudDailyMap();
    map[dateStr] = Math.max(0, val);
    localStorage.setItem(CLOUD_DAILY_MAP_KEY, JSON.stringify(map));
  } catch {}
}

function getCachedCloudToday(): number {
  const today = getKstDateString();
  const map = getCachedCloudDailyMap();
  return typeof map[today] === "number" ? map[today] : 0;
}

function setCachedCloudToday(val: number): void {
  setCachedCloudDailyValue(getKstDateString(), val);
}

function loadPersistedRealLedger(): PersistentAnalyticsLedger {
  const empty = createEmptyRealLedger("real");
  if (typeof window === "undefined") return empty;
  try {
    const raw = localStorage.getItem(LEDGER_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as PersistentAnalyticsLedger;
      if (parsed && parsed.trackingMode === "real") {
        const dates = getDatesLastNDays(14);
        if (!parsed.dailyStats) parsed.dailyStats = {};
        dates.forEach((d) => {
          if (typeof parsed.dailyStats[d] !== "number") {
            parsed.dailyStats[d] = 0;
          }
        });
        if (!parsed.activeSessions) parsed.activeSessions = {};
        if (!parsed.sessionDurations) parsed.sessionDurations = {};
        if (!parsed.uniqueSessionIds) parsed.uniqueSessionIds = {};
        return parsed;
      }
    }
  } catch {}
  return empty;
}

/**
 * Real Cloud-Synced Ledger Builder:
 * - Preserves 100% genuine local/session visits (countries, referrers, languages, pages, devices, active sessions, stay seconds).
 * - Merges Abacus Cloud `global_visits` & per-day `day_YYYY-MM-DD` counts cleanly without inventing fake visitor logs or floors.
 */
export function buildRealCloudSyncedLedger(
  cloudTotalOverride?: number,
  cloudTodayOverride?: number,
  dailyMapOverride?: Record<string, number>
): PersistentAnalyticsLedger {
  const ledger = loadPersistedRealLedger();
  const cloudTotal = typeof cloudTotalOverride === "number" ? cloudTotalOverride : getCachedCloudCount();
  const cloudDailyMap = { ...getCachedCloudDailyMap(), ...(dailyMapOverride || {}) };
  const today = getKstDateString();
  if (typeof cloudTodayOverride === "number") {
    cloudDailyMap[today] = cloudTodayOverride;
  }

  const dates = getDatesLastNDays(14);
  dates.forEach((dateStr) => {
    if (dateStr >= REAL_CLOUD_DAILY_START_DATE) {
      const cloudDayVal = typeof cloudDailyMap[dateStr] === "number" ? cloudDailyMap[dateStr] : 0;
      ledger.dailyStats[dateStr] = Math.max(ledger.dailyStats[dateStr] || 0, cloudDayVal);
    }
  });

  const localTotal = ledger.localVisitsCount ?? 0;
  const todayVal = ledger.dailyStats[today] || 0;
  ledger.todayDate = today;
  ledger.totalVisits = Math.max(cloudTotal, localTotal, ledger.totalVisits || 0, todayVal);
  ledger.uniqueVisitorsCount = Object.keys(ledger.uniqueSessionIds || {}).length;
  ledger.lastSyncedCloudTotal = cloudTotal;
  ledger.lastUpdated = Date.now();
  return ledger;
}

// Keep export alias for compatibility
export const buildGlobalSyncedCampaignLedger = buildRealCloudSyncedLedger;

export const ZERO_FALLBACK_STATS: AnalyticsStatsResponse = computeStatsFromLedger(createZeroLedger());
export const SEED_FALLBACK_STATS: AnalyticsStatsResponse = computeStatsFromLedger(createSeedLedger());
export const DEFAULT_FALLBACK_STATS: AnalyticsStatsResponse = computeStatsFromLedger(createEmptyRealLedger("real"));

function getActiveMode(): "real" | "zero" | "seed" {
  if (typeof window === "undefined") return "real";
  try {
    const savedMode = localStorage.getItem(ANALYTICS_MODE_KEY);
    if (savedMode === "zero" || savedMode === "seed" || savedMode === "real") {
      return savedMode;
    }
  } catch {}
  return "real";
}

function getLedger(): PersistentAnalyticsLedger {
  if (typeof window === "undefined") return createEmptyRealLedger("real");

  const mode = getActiveMode();
  if (mode === "real") {
    return buildRealCloudSyncedLedger();
  }

  try {
    const raw = localStorage.getItem(LEDGER_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as PersistentAnalyticsLedger;
      if (parsed && typeof parsed.totalVisits === "number" && parsed.trackingMode === mode) {
        const dates = getDatesLastNDays(14);
        if (!parsed.dailyStats) parsed.dailyStats = {};
        dates.forEach((d) => {
          if (typeof parsed.dailyStats[d] !== "number") {
            parsed.dailyStats[d] = 0;
          }
        });
        if (!parsed.activeSessions) parsed.activeSessions = {};
        if (!parsed.sessionDurations) parsed.sessionDurations = {};
        if (!parsed.uniqueSessionIds) parsed.uniqueSessionIds = {};
        return parsed;
      }
    }
  } catch {}

  const initial = mode === "zero" ? createZeroLedger() : createSeedLedger();
  try {
    localStorage.setItem(LEDGER_STORAGE_KEY, JSON.stringify(initial));
  } catch {}
  return initial;
}

function broadcastStatsUpdate(stats: AnalyticsStatsResponse) {
  if (typeof window === "undefined") return;
  try {
    window.dispatchEvent(new CustomEvent("corea-analytics-updated", { detail: stats }));
  } catch {}
  try {
    if ("BroadcastChannel" in window) {
      const bc = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      bc.postMessage({ type: "STATS_UPDATED", stats });
      bc.close();
    }
  } catch {}
}

function saveLedger(ledger: PersistentAnalyticsLedger): AnalyticsStatsResponse {
  ledger.lastUpdated = Date.now();

  // Prune expired active sessions (> 5 minutes idle)
  const cutoff = Date.now() - ACTIVE_SESSION_WINDOW_MS;
  if (ledger.activeSessions) {
    Object.keys(ledger.activeSessions).forEach((sid) => {
      if (ledger.activeSessions[sid] < cutoff) {
        delete ledger.activeSessions[sid];
      }
    });
  }

  const computed = computeStatsFromLedger(ledger);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(LEDGER_STORAGE_KEY, JSON.stringify(ledger));
      localStorage.setItem(ANALYTICS_CACHE_KEY, JSON.stringify(computed));
      localStorage.setItem(ANALYTICS_MODE_KEY, ledger.trackingMode || "real");
    } catch {}
    broadcastStatsUpdate(computed);
  }
  return computed;
}

function getSessionId(): string {
  try {
    let sid = sessionStorage.getItem("corea_labs_session_id");
    if (!sid) {
      sid = "sess_" + Date.now() + "_" + Math.random().toString(36).substring(2, 8);
      sessionStorage.setItem("corea_labs_session_id", sid);
    }
    return sid;
  } catch {
    return "sess_anonymous";
  }
}

function getDeviceType(): "mobile" | "tablet" | "desktop" {
  if (typeof window === "undefined") return "desktop";
  const ua = navigator.userAgent.toLowerCase();
  if (/(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(ua)) {
    return "tablet";
  }
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile|wpdesktop/.test(ua)) {
    return "mobile";
  }
  return "desktop";
}

export function classifyTrafficSource(rawInput: string): { key: string; label: string } {
  const s = (rawInput || "").toLowerCase().trim();
  if (!s || s === "direct" || s.includes("corea-labs.com") || s.includes("localhost") || s.includes("run.app")) {
    return { key: "Direct / corea-labs.com", label: "직접 접속 (Direct / 북마크)" };
  }
  if (s.includes("qr") || s.includes("qrcode") || s.includes("poster") || s.includes("flyer")) {
    return { key: "QR Code Scan", label: "QR 코드 스캔 (포스터·오프라인)" };
  }
  if (s.includes("chatgpt") || s.includes("openai") || s.includes("perplexity") || s.includes("claude") || s.includes("gemini") || s.includes("copilot") || s.includes("ai_search")) {
    return { key: "AI Search (ChatGPT / Perplexity)", label: "AI 검색 추천 (ChatGPT·Perplexity)" };
  }
  if (s.includes("google") || s.includes("gclid") || s.includes("bing") || s.includes("duckduckgo") || s.includes("yahoo")) {
    return { key: "Google Search", label: "Google / 글로벌 검색 (자연 유입)" };
  }
  if (s.includes("reddit") || s.includes("redd.it")) {
    return { key: "Reddit (r/koreatravel)", label: "Reddit (r/koreatravel 커뮤니티)" };
  }
  if (s.includes("whatsapp") || s.includes("wa.me")) {
    return { key: "WhatsApp", label: "WhatsApp 글로벌 메신저 공유" };
  }
  if (s.includes("instagram") || s.includes("tiktok") || s.includes("ttclid") || s.includes("ig")) {
    return { key: "Instagram / TikTok", label: "Instagram · TikTok (글로벌 숏폼)" };
  }
  if (s.includes("twitter") || s.includes("x.com") || s.includes("t.co") || s.includes("x_twitter")) {
    return { key: "X (Twitter)", label: "X (트위터) 글로벌 여행 추천" };
  }
  if (s.includes("xiaohongshu") || s.includes("xhs") || s.includes("weibo") || s.includes("baidu")) {
    return { key: "Xiaohongshu (小红书)", label: "Xiaohongshu (중국 샤오홍슈·웨이보)" };
  }
  if (s.includes("line") || s.includes("note.com")) {
    return { key: "LINE / Others", label: "LINE 메신저 (일본·대만·태국)" };
  }
  if (s.includes("pinterest") || s.includes("pin.it") || s.includes("tripadvisor") || s.includes("lonelyplanet")) {
    return { key: "Pinterest / TripAdvisor", label: "Pinterest · TripAdvisor 여행 포럼" };
  }
  if (s.includes("facebook") || s.includes("fb.com") || s.includes("fbclid") || s.includes("telegram") || s.includes("t.me")) {
    return { key: "Facebook / Telegram", label: "Facebook · Telegram 여행자 그룹" };
  }
  return { key: rawInput, label: `${rawInput} (외부 추천 링크)` };
}

function detectCurrentTrafficSource(overrideSource?: string): { key: string; label: string } {
  if (overrideSource) {
    return classifyTrafficSource(overrideSource);
  }
  if (typeof window === "undefined") {
    return { key: "Direct / corea-labs.com", label: "직접 접속 (Direct / 북마크)" };
  }

  try {
    const params = new URLSearchParams(window.location.search);
    const utmSource = params.get("utm_source") || params.get("ref") || params.get("source");
    if (utmSource) {
      const classified = classifyTrafficSource(utmSource);
      try {
        sessionStorage.setItem("corea_labs_entry_source", classified.key);
      } catch {}
      return classified;
    }
    if (params.get("gclid")) return classifyTrafficSource("google");
    if (params.get("fbclid")) return classifyTrafficSource("facebook");
    if (params.get("ttclid")) return classifyTrafficSource("tiktok");
  } catch {}

  try {
    if (typeof document !== "undefined" && document.referrer) {
      const refHost = new URL(document.referrer).hostname;
      if (refHost && !refHost.includes(window.location.hostname)) {
        const classified = classifyTrafficSource(refHost);
        try {
          sessionStorage.setItem("corea_labs_entry_source", classified.key);
        } catch {}
        return classified;
      }
    }
  } catch {}

  try {
    const savedSessionSource = sessionStorage.getItem("corea_labs_entry_source");
    if (savedSessionSource) {
      return classifyTrafficSource(savedSessionSource);
    }
  } catch {}

  return { key: "Direct / corea-labs.com", label: "직접 접속 (Direct / 북마크)" };
}

function recordVisitInBrowserLedger(params: {
  sessionId: string;
  language: string;
  path: string;
  referrerKey: string;
  referrerLabel: string;
  timezone: string;
  device: "mobile" | "tablet" | "desktop";
  isNewSessionVisit: boolean;
}): AnalyticsStatsResponse {
  const mode = getActiveMode();
  const ledger = mode === "real" ? loadPersistedRealLedger() : getLedger();
  const detectedCountry = resolveCountry(params.timezone, params.language);
  const today = getKstDateString();
  ledger.todayDate = today;

  if (!ledger.activeSessions) ledger.activeSessions = {};
  ledger.activeSessions[params.sessionId] = Date.now();

  if (!ledger.sessionDurations) ledger.sessionDurations = {};
  if (typeof ledger.sessionDurations[params.sessionId] !== "number") {
    ledger.sessionDurations[params.sessionId] = 1;
  }

  const pKey = params.path || "home";
  const langKey = params.language || "en";
  const dKey = params.device || "desktop";
  const cKey = detectedCountry.code || "US";
  const refKey = params.referrerKey || "Direct / corea-labs.com";
  const refLabel = params.referrerLabel || "직접 접속 (Direct / 북마크)";

  if (params.isNewSessionVisit) {
    ledger.localVisitsCount = (ledger.localVisitsCount || 0) + 1;
    ledger.totalVisits = (ledger.totalVisits || 0) + 1;

    if (!ledger.uniqueSessionIds) ledger.uniqueSessionIds = {};
    if (params.sessionId && !ledger.uniqueSessionIds[params.sessionId]) {
      ledger.uniqueSessionIds[params.sessionId] = true;
    }
    ledger.uniqueVisitorsCount = Object.keys(ledger.uniqueSessionIds).length;

    if (!ledger.dailyStats) ledger.dailyStats = {};
    ledger.dailyStats[today] = (ledger.dailyStats[today] || 0) + 1;

    if (!ledger.countryStats) ledger.countryStats = {};
    if (!ledger.countryStats[cKey]) {
      ledger.countryStats[cKey] = { ...detectedCountry, count: 1 };
    } else {
      ledger.countryStats[cKey].count += 1;
    }

    if (!ledger.languageStats) ledger.languageStats = {};
    if (!ledger.languageStats[langKey]) {
      ledger.languageStats[langKey] = {
        code: langKey,
        name: LANGUAGE_LABELS[langKey] || langKey,
        count: 1,
      };
    } else {
      ledger.languageStats[langKey].count += 1;
    }

    if (!ledger.deviceStats) ledger.deviceStats = {};
    if (!ledger.deviceStats[dKey]) {
      ledger.deviceStats[dKey] = {
        name: DEVICE_LABELS[dKey] || dKey,
        count: 1,
      };
    } else {
      ledger.deviceStats[dKey].count += 1;
    }

    if (!ledger.referrerStats) ledger.referrerStats = {};
    if (!ledger.referrerStats[refKey]) {
      ledger.referrerStats[refKey] = {
        name: refLabel,
        count: 1,
      };
    } else {
      ledger.referrerStats[refKey].count += 1;
    }

    if (!ledger.recentVisitors) ledger.recentVisitors = [];
    ledger.recentVisitors.unshift({
      id: "v_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
      sessionId: params.sessionId,
      timestamp: new Date().toISOString(),
      country: detectedCountry.name,
      flag: detectedCountry.flag,
      code: detectedCountry.code,
      path: pKey,
      device: dKey,
      language: langKey,
      referrer: refLabel,
      staySeconds: ledger.sessionDurations[params.sessionId] || 1,
    });
    if (ledger.recentVisitors.length > 50) {
      ledger.recentVisitors = ledger.recentVisitors.slice(0, 50);
    }
  } else {
    // Same active session switching tab/language: update latest viewed path & active timestamp without double counting visit
    if (Array.isArray(ledger.recentVisitors)) {
      const existing = ledger.recentVisitors.find((v) => v.sessionId === params.sessionId);
      if (existing) {
        existing.path = pKey;
        existing.language = langKey;
        existing.timestamp = new Date().toISOString();
        existing.staySeconds = ledger.sessionDurations[params.sessionId] || existing.staySeconds;
      }
    }
  }

  // Always record real page view breakdown per tab click
  if (!ledger.pageStats) ledger.pageStats = {};
  if (!ledger.pageStats[pKey]) {
    ledger.pageStats[pKey] = {
      path: pKey,
      name: PAGE_LABELS[pKey] || pKey,
      count: 1,
    };
  } else {
    ledger.pageStats[pKey].count += 1;
  }

  if (mode === "real") {
    const cloudTotal = getCachedCloudCount();
    const cloudToday = getCachedCloudToday();
    ledger.dailyStats[today] = Math.max(ledger.dailyStats[today] || 0, cloudToday);
    ledger.totalVisits = Math.max(ledger.totalVisits, cloudTotal, ledger.dailyStats[today]);
  }

  return saveLedger(ledger);
}

function fetchWithTimeout(url: string, timeoutMs: number = 1500): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { signal: controller.signal }).finally(() => clearTimeout(timer));
}

export function getAnalyticsStatsSync(): AnalyticsStatsResponse {
  if (typeof window !== "undefined") {
    try {
      const cachedRaw = localStorage.getItem(ANALYTICS_CACHE_KEY);
      if (cachedRaw) {
        const parsed = JSON.parse(cachedRaw) as AnalyticsStatsResponse;
        if (parsed && parsed.summary && typeof parsed.summary.totalVisits === "number") {
          return parsed;
        }
      }
    } catch {}
  }
  return computeStatsFromLedger(getLedger());
}

async function hitGlobalCloudCounter(): Promise<{ total: number | null; today: number | null }> {
  try {
    const today = getKstDateString();
    const [globalRes, todayRes] = await Promise.all([
      fetchWithTimeout(`${ABACUS_CLOUD_BASE}/hit/${ABACUS_NAMESPACE}/global_visits`, 1800),
      fetchWithTimeout(`${ABACUS_CLOUD_BASE}/hit/${ABACUS_NAMESPACE}/day_${today}`, 1800).catch(() => null),
    ]);
    let totalVal: number | null = null;
    let todayVal: number | null = null;
    if (globalRes && globalRes.ok) {
      const data = await globalRes.json();
      if (typeof data?.value === "number") {
        totalVal = data.value;
        setCachedCloudCount(totalVal);
      }
    }
    if (todayRes && todayRes.ok) {
      const tData = await todayRes.json();
      if (typeof tData?.value === "number") {
        todayVal = tData.value;
        setCachedCloudToday(todayVal);
      }
    }
    return { total: totalVal, today: todayVal };
  } catch {}
  return { total: null, today: null };
}

let lastCloudSyncTime = 0;
let activeCloudSyncPromise: Promise<void> | null = null;

async function syncWithGlobalCloudCounter(forceNetwork: boolean = false): Promise<void> {
  const now = Date.now();
  if (!forceNetwork && now - lastCloudSyncTime < 10000) {
    return;
  }
  if (activeCloudSyncPromise) {
    return activeCloudSyncPromise;
  }

  activeCloudSyncPromise = (async () => {
    try {
      const mode = getActiveMode();
      if (mode !== "real") return;

      lastCloudSyncTime = Date.now();
      const today = getKstDateString();
      const recentDates = getDatesLastNDays(14).filter((d) => d >= REAL_CLOUD_DAILY_START_DATE);

      const [globalRes, ...dayResults] = await Promise.all([
        fetchWithTimeout(`${ABACUS_CLOUD_BASE}/get/${ABACUS_NAMESPACE}/global_visits`, 1500),
        ...recentDates.map((d) =>
          fetchWithTimeout(`${ABACUS_CLOUD_BASE}/get/${ABACUS_NAMESPACE}/day_${d}`, 1500)
            .then(async (r) => ({ date: d, val: r.ok ? (await r.json())?.value : undefined }))
            .catch(() => ({ date: d, val: undefined }))
        ),
      ]);

      if (!globalRes.ok) return;
      const globalData = await globalRes.json();
      const cloudValue = typeof globalData?.value === "number" ? globalData.value : null;
      if (cloudValue === null) return;

      const updatedDailyMap: Record<string, number> = { ...getCachedCloudDailyMap() };
      dayResults.forEach((item) => {
        if (typeof item.val === "number") {
          updatedDailyMap[item.date] = item.val;
          setCachedCloudDailyValue(item.date, item.val);
        }
      });

      const cloudTodayVal =
        typeof updatedDailyMap[today] === "number" ? updatedDailyMap[today] : getCachedCloudToday();
      setCachedCloudCount(cloudValue);

      const syncedLedger = buildRealCloudSyncedLedger(cloudValue, cloudTodayVal, updatedDailyMap);
      saveLedger(syncedLedger);
    } catch {}
  })().finally(() => {
    activeCloudSyncPromise = null;
  });

  return activeCloudSyncPromise;
}

let lastTrackedKey = "";
let lastTrackedTime = 0;

export async function trackPageView(
  page: string,
  language: string = "en",
  force: boolean = false,
  overrideSource?: string
): Promise<AnalyticsStatsResponse | null> {
  try {
    const now = Date.now();
    const trackKey = `${page}:${language}`;
    if (!force && lastTrackedKey === trackKey && now - lastTrackedTime < 1200) {
      return getAnalyticsStatsSync();
    }
    lastTrackedKey = trackKey;
    lastTrackedTime = now;

    const today = getKstDateString();
    // Scope cloud session hit key to today's KST date so midnight rollover records the new day accurately
    const sessionHitKey = `corea_labs_cloud_session_hit_${today}`;
    const alreadyHitToday =
      !force && typeof sessionStorage !== "undefined" && sessionStorage.getItem(sessionHitKey) === "1";

    const sessionId = force
      ? "sess_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6)
      : getSessionId();
    const device = getDeviceType();
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    const channel = detectCurrentTrafficSource(overrideSource);

    if (!alreadyHitToday) {
      try {
        if (typeof sessionStorage !== "undefined") {
          sessionStorage.setItem(sessionHitKey, "1");
        }
      } catch {}

      if (getActiveMode() === "real") {
        hitGlobalCloudCounter().then(({ total, today: cloudToday }) => {
          if (typeof total === "number" && getActiveMode() === "real") {
            saveLedger(buildRealCloudSyncedLedger(total, typeof cloudToday === "number" ? cloudToday : undefined));
          }
        });
      }
    } else if (getActiveMode() === "real") {
      syncWithGlobalCloudCounter().catch(() => {});
    }

    const updatedStats = recordVisitInBrowserLedger({
      sessionId,
      language,
      path: page,
      referrerKey: channel.key,
      referrerLabel: channel.label,
      timezone,
      device,
      isNewSessionVisit: !alreadyHitToday,
    });

    if (!alreadyHitToday) {
      // Fire-and-forget local server log when Express backend is present (silent no-op on static Cloudflare Pages)
      fetch(`/api/analytics/track?_t=${now}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          language,
          path: page,
          referrer: channel.key,
          timezone,
          device,
        }),
      }).catch(() => {});
    }

    return updatedStats;
  } catch {
    return null;
  }
}

export function recordSessionHeartbeat(elapsedIncrementSec: number = 5): void {
  if (typeof window === "undefined") return;
  const mode = getActiveMode();
  if (mode === "seed") return;

  try {
    const sessionId = getSessionId();
    const ledger = mode === "real" ? loadPersistedRealLedger() : getLedger();

    if (!ledger.activeSessions) ledger.activeSessions = {};
    ledger.activeSessions[sessionId] = Date.now();

    if (!ledger.sessionDurations) ledger.sessionDurations = {};
    let currentElapsed = ledger.sessionDurations[sessionId] || 0;
    try {
      const savedElapsed = parseInt(sessionStorage.getItem(SESSION_ELAPSED_KEY) || "0", 10);
      if (!isNaN(savedElapsed) && savedElapsed > currentElapsed) {
        currentElapsed = savedElapsed;
      }
    } catch {}

    const nextElapsed = currentElapsed + Math.max(0, elapsedIncrementSec);
    ledger.sessionDurations[sessionId] = nextElapsed;
    try {
      sessionStorage.setItem(SESSION_ELAPSED_KEY, String(nextElapsed));
    } catch {}

    if (Array.isArray(ledger.recentVisitors)) {
      const entry = ledger.recentVisitors.find((v) => v.sessionId === sessionId);
      if (entry) {
        entry.staySeconds = nextElapsed;
        entry.timestamp = new Date().toISOString();
      }
    }

    saveLedger(ledger);

    fetch("/api/analytics/heartbeat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, staySeconds: nextElapsed }),
    }).catch(() => {});
  } catch {}
}

export async function fetchAnalyticsStats(forceNetwork: boolean = false): Promise<AnalyticsStatsResponse> {
  if (forceNetwork) {
    await syncWithGlobalCloudCounter(true);
  } else {
    syncWithGlobalCloudCounter(false).catch(() => {});
  }
  const localLedger = getLedger();
  return saveLedger(localLedger);
}

export async function resetAnalyticsData(mode: "real" | "zero" | "seed" | "campaign" = "real"): Promise<boolean> {
  try {
    const normalizedMode: "real" | "zero" | "seed" =
      mode === "seed" ? "seed" : mode === "zero" ? "zero" : "real";

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(ANALYTICS_MODE_KEY, normalizedMode);
        if (normalizedMode === "zero") {
          sessionStorage.removeItem(SESSION_ELAPSED_KEY);
          const today = getKstDateString();
          sessionStorage.removeItem(`corea_labs_cloud_session_hit_${today}`);
        }
      } catch {}
    }

    const nextLedger =
      normalizedMode === "seed"
        ? createSeedLedger()
        : normalizedMode === "zero"
        ? createZeroLedger()
        : createEmptyRealLedger("real");

    lastTrackedKey = "";
    lastTrackedTime = 0;

    saveLedger(nextLedger);

    if (normalizedMode === "real") {
      await syncWithGlobalCloudCounter(true);
      await trackPageView("home", "ko", true);
    } else if (normalizedMode === "zero") {
      await trackPageView("home", "ko", true);
    }

    try {
      await fetch(`/api/analytics/reset?_t=${Date.now()}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: normalizedMode }),
      });
    } catch {}

    return true;
  } catch (err) {
    console.error("Failed to reset analytics ledger:", err);
    return false;
  }
}

/**
 * Trigger real search engine IndexNow / WebSub sitemap pings WITHOUT inflating visitor counts.
 */
export async function triggerGlobalSeoPingAndBoost(): Promise<AnalyticsStatsResponse> {
  try {
    await fetch("/api/promote/ping", { method: "POST" }).catch(() => null);
  } catch {}
  return fetchAnalyticsStats(true);
}

let globalStreamInterval: number | null = null;
let heartbeatInterval: number | null = null;

export function startGlobalCampaignStream(): () => void {
  if (typeof window === "undefined") return () => {};
  if (globalStreamInterval !== null) window.clearInterval(globalStreamInterval);
  if (heartbeatInterval !== null) window.clearInterval(heartbeatInterval);

  // Initial cloud sync on mount
  syncWithGlobalCloudCounter().catch(() => {});

  // Poll cloud counter every 30 seconds for real cross-device visitors
  globalStreamInterval = window.setInterval(() => {
    const mode = getActiveMode();
    if (mode !== "real") return;
    syncWithGlobalCloudCounter().catch(() => {});
  }, 30000);

  // Accumulate real dwell time every 5 seconds while tab is visible
  heartbeatInterval = window.setInterval(() => {
    if (document.visibilityState === "visible") {
      recordSessionHeartbeat(5);
    }
  }, 5000);

  const handleVisibility = () => {
    if (document.visibilityState === "visible") {
      recordSessionHeartbeat(1);
    }
  };
  document.addEventListener("visibilitychange", handleVisibility);

  return () => {
    if (globalStreamInterval !== null) {
      window.clearInterval(globalStreamInterval);
      globalStreamInterval = null;
    }
    if (heartbeatInterval !== null) {
      window.clearInterval(heartbeatInterval);
      heartbeatInterval = null;
    }
    document.removeEventListener("visibilitychange", handleVisibility);
  };
}

export function subscribeToAnalyticsUpdates(callback: (stats: AnalyticsStatsResponse) => void): () => void {
  if (typeof window === "undefined") return () => {};

  const handleCustomEvent = (e: Event) => {
    const customEvent = e as CustomEvent<AnalyticsStatsResponse>;
    if (customEvent.detail && customEvent.detail.summary) {
      callback(customEvent.detail);
    } else {
      callback(computeStatsFromLedger(getLedger()));
    }
  };

  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === LEDGER_STORAGE_KEY || e.key === ANALYTICS_MODE_KEY || e.key === CLOUD_COUNT_CACHE_KEY) {
      callback(computeStatsFromLedger(getLedger()));
    }
  };

  window.addEventListener("corea-analytics-updated", handleCustomEvent);
  window.addEventListener("storage", handleStorageEvent);

  let bc: BroadcastChannel | null = null;
  try {
    if ("BroadcastChannel" in window) {
      bc = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      bc.onmessage = (event) => {
        if (event.data?.type === "STATS_UPDATED" && event.data?.stats) {
          callback(event.data.stats);
        } else {
          callback(computeStatsFromLedger(getLedger()));
        }
      };
    }
  } catch {}

  return () => {
    window.removeEventListener("corea-analytics-updated", handleCustomEvent);
    window.removeEventListener("storage", handleStorageEvent);
    if (bc) {
      try {
        bc.close();
      } catch {}
    }
  };
}
