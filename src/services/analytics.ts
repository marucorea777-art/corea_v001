export interface VisitorSummary {
  totalVisits: number;
  uniqueVisitors: number;
  todayVisits: number;
  intlRatio: number;
  avgDuration: string;
  onlineNow: number;
  isPureRealOnly?: boolean;
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
  timestamp: string;
  country: string;
  flag: string;
  code: string;
  path: string;
  device: string;
  language: string;
  referrer?: string;
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

const ANALYTICS_CACHE_KEY = "corea_labs_analytics_cache";

export const DEFAULT_FALLBACK_STATS: AnalyticsStatsResponse = {
  summary: {
    totalVisits: 14821,
    uniqueVisitors: 11291,
    todayVisits: 433,
    intlRatio: 97.4,
    avgDuration: "4m 18s",
    onlineNow: 25,
  },
  countries: [
    { code: "US", name: "United States", flag: "🇺🇸", count: 4821, percentage: 32.5 },
    { code: "JP", name: "Japan", flag: "🇯🇵", count: 2750, percentage: 18.6 },
    { code: "CN", name: "China", flag: "🇨🇳", count: 2120, percentage: 14.3 },
    { code: "TW", name: "Taiwan", flag: "🇹🇼", count: 1180, percentage: 8.0 },
    { code: "GB", name: "United Kingdom", flag: "🇬🇧", count: 950, percentage: 6.4 },
    { code: "FR", name: "France", flag: "🇫🇷", count: 720, percentage: 4.9 },
    { code: "DE", name: "Germany", flag: "🇩🇪", count: 640, percentage: 4.3 },
    { code: "TH", name: "Thailand", flag: "🇹🇭", count: 590, percentage: 4.0 },
    { code: "AU", name: "Australia", flag: "🇦🇺", count: 530, percentage: 3.6 },
    { code: "CA", name: "Canada", flag: "🇨🇦", count: 420, percentage: 2.8 },
    { code: "KR", name: "South Korea", flag: "🇰🇷", count: 390, percentage: 2.6 },
    { code: "ES", name: "Spain", flag: "🇪🇸", count: 280, percentage: 1.9 },
    { code: "SG", name: "Singapore", flag: "🇸🇬", count: 240, percentage: 1.6 },
    { code: "OTHER", name: "Other Countries", flag: "🌐", count: 190, percentage: 1.3 },
  ],
  languages: [
    { code: "en", name: "English (영어)", count: 8451, percentage: 57.0 },
    { code: "ja", name: "Japanese (일본어)", count: 2420, percentage: 16.3 },
    { code: "zh", name: "Chinese (중국어)", count: 1980, percentage: 13.4 },
    { code: "ko", name: "Korean (한국어)", count: 680, percentage: 4.6 },
    { code: "th", name: "Thai (태국어)", count: 420, percentage: 2.8 },
    { code: "fr", name: "French (프랑스어)", count: 310, percentage: 2.1 },
    { code: "es", name: "Spanish (스페인어)", count: 260, percentage: 1.8 },
    { code: "ru", name: "Russian (러시아어)", count: 150, percentage: 1.0 },
    { code: "other", name: "Others (기타 언어)", count: 150, percentage: 1.0 },
  ],
  pages: [
    { path: "festivals", name: "전국 축제 (Festivals)", count: 6241, percentage: 42.1 },
    { path: "travel", name: "입국 & 환전 가이드 (Travel Guide)", count: 3710, percentage: 25.0 },
    { path: "places", name: "추천 명소 (Places)", count: 2460, percentage: 16.6 },
    { path: "heritage", name: "왕실 문화유산 (Heritage)", count: 1380, percentage: 9.3 },
    { path: "culture", name: "전통 문화 (Culture)", count: 620, percentage: 4.2 },
    { path: "home", name: "홈 & 코리아 랩스 (Home)", count: 410, percentage: 2.8 },
  ],
  devices: [
    { name: "모바일 (Mobile)", count: 10079, percentage: 68.0 },
    { name: "데스크톱 (Desktop)", count: 4150, percentage: 28.0 },
    { name: "태블릿 (Tablet)", count: 592, percentage: 4.0 },
  ],
  referrers: [
    { name: "Google 검색 (자연 유입)", count: 6224, percentage: 42.0 },
    { name: "직접 접속 (Direct / 북마크)", count: 3853, percentage: 26.0 },
    { name: "WhatsApp 공유 링크", count: 2075, percentage: 14.0 },
    { name: "Reddit 커뮤니티", count: 1334, percentage: 9.0 },
    { name: "X (트위터) 여행 추천", count: 741, percentage: 5.0 },
    { name: "LINE 메신저 및 기타", count: 593, percentage: 4.0 },
  ],
  dailyTrend: [
    { date: "2026-10-11", count: 310 },
    { date: "2026-10-12", count: 335 },
    { date: "2026-10-13", count: 360 },
    { date: "2026-10-14", count: 380 },
    { date: "2026-10-15", count: 410 },
    { date: "2026-10-16", count: 395 },
    { date: "2026-10-17", count: 420 },
    { date: "2026-10-18", count: 385 },
    { date: "2026-10-19", count: 412 },
    { date: "2026-10-20", count: 398 },
    { date: "2026-10-21", count: 445 },
    { date: "2026-10-22", count: 480 },
    { date: "2026-10-23", count: 520 },
    { date: "2026-10-24", count: 433 },
  ],
  recentVisitors: [
    { id: "v_1", timestamp: new Date(Date.now() - 1000 * 45).toISOString(), country: "United States", flag: "🇺🇸", code: "US", path: "festivals", device: "mobile", language: "en", referrer: "direct" },
    { id: "v_2", timestamp: new Date(Date.now() - 1000 * 120).toISOString(), country: "Japan", flag: "🇯🇵", code: "JP", path: "places", device: "desktop", language: "ja", referrer: "direct" },
    { id: "v_3", timestamp: new Date(Date.now() - 1000 * 240).toISOString(), country: "France", flag: "🇫🇷", code: "FR", path: "travel", device: "mobile", language: "fr", referrer: "direct" },
    { id: "v_4", timestamp: new Date(Date.now() - 1000 * 380).toISOString(), country: "United Kingdom", flag: "🇬🇧", code: "GB", path: "festivals", device: "desktop", language: "en", referrer: "direct" },
    { id: "v_5", timestamp: new Date(Date.now() - 1000 * 520).toISOString(), country: "Taiwan", flag: "🇹🇼", code: "TW", path: "heritage", device: "mobile", language: "zh", referrer: "direct" },
    { id: "v_6", timestamp: new Date(Date.now() - 1000 * 680).toISOString(), country: "Germany", flag: "🇩🇪", code: "DE", path: "places", device: "mobile", language: "en", referrer: "direct" },
    { id: "v_7", timestamp: new Date(Date.now() - 1000 * 850).toISOString(), country: "Thailand", flag: "🇹🇭", code: "TH", path: "travel", device: "mobile", language: "th", referrer: "direct" },
    { id: "v_8", timestamp: new Date(Date.now() - 1000 * 1100).toISOString(), country: "Australia", flag: "🇦🇺", code: "AU", path: "festivals", device: "desktop", language: "en", referrer: "direct" },
  ],
};

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

let lastTrackedPath: string = "";
let lastTrackedTime: number = 0;

export async function trackPageView(page: string, language: string = "en") {
  try {
    const now = Date.now();
    // Debounce duplicate tracking within 2 seconds for the same page
    if (lastTrackedPath === page && now - lastTrackedTime < 2000) {
      return;
    }
    lastTrackedPath = page;
    lastTrackedTime = now;

    const sessionId = getSessionId();
    const device = getDeviceType();
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    const referrer = document.referrer ? new URL(document.referrer).hostname : "direct";

    await fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        language,
        path: page,
        referrer,
        timezone,
        device,
      }),
    });
  } catch (err) {
    // Non-blocking background telemetry
  }
}

export const ZERO_FALLBACK_STATS: AnalyticsStatsResponse = {
  summary: {
    totalVisits: 0,
    uniqueVisitors: 0,
    todayVisits: 0,
    intlRatio: 0,
    avgDuration: "0m 00s",
    onlineNow: 1,
    isPureRealOnly: true,
  },
  countries: [],
  languages: [],
  pages: [],
  devices: [],
  referrers: [],
  dailyTrend: [],
  recentVisitors: [],
};

export async function fetchAnalyticsStats(): Promise<AnalyticsStatsResponse> {
  try {
    const res = await fetch("/api/analytics/stats", {
      cache: "no-store",
      headers: { "Pragma": "no-cache", "Cache-Control": "no-cache" }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const ct = res.headers.get("content-type");
    if (!ct || !ct.includes("application/json")) {
      throw new Error("Server returned non-JSON response");
    }
    const data: AnalyticsStatsResponse = await res.json();
    if (data && data.summary) {
      try {
        localStorage.setItem(ANALYTICS_CACHE_KEY, JSON.stringify(data));
        if (data.summary.isPureRealOnly) {
          localStorage.setItem("corea_labs_analytics_mode", "zero");
        } else {
          localStorage.setItem("corea_labs_analytics_mode", "seed");
        }
      } catch {}
      return data;
    }
    throw new Error("Invalid schema");
  } catch (err) {
    console.warn("fetchAnalyticsStats network issue, loading from cache or fallback:", err);
    try {
      const cached = localStorage.getItem(ANALYTICS_CACHE_KEY);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch {}
    const mode = localStorage.getItem("corea_labs_analytics_mode");
    if (mode === "zero") {
      return ZERO_FALLBACK_STATS;
    }
    return DEFAULT_FALLBACK_STATS;
  }
}

export async function resetAnalyticsData(mode: "zero" | "seed" = "seed"): Promise<boolean> {
  try {
    const res = await fetch("/api/analytics/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode })
    });
    if (res.ok) {
      try {
        localStorage.setItem("corea_labs_analytics_mode", mode);
        localStorage.removeItem(ANALYTICS_CACHE_KEY);
      } catch {}
      return true;
    }
    return false;
  } catch (err) {
    return false;
  }
}
