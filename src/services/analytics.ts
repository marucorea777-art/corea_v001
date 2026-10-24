export interface VisitorSummary {
  totalVisits: number;
  uniqueVisitors: number;
  todayVisits: number;
  intlRatio: number;
  avgDuration: string;
  onlineNow: number;
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

export async function fetchAnalyticsStats(): Promise<AnalyticsStatsResponse | null> {
  try {
    const res = await fetch("/api/analytics/stats");
    if (!res.ok) throw new Error("Failed to load statistics");
    return await res.json();
  } catch (err) {
    console.error("fetchAnalyticsStats error:", err);
    return null;
  }
}

export async function resetAnalyticsData(): Promise<boolean> {
  try {
    const res = await fetch("/api/analytics/reset", { method: "POST" });
    return res.ok;
  } catch (err) {
    return false;
  }
}
