// Google Analytics 4 (GA4) Real-Time Measurement & Event Tracking Service

export const GA4_STORAGE_KEY = "corea_labs_ga4_measurement_id";

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
    __coreaGa4LoadedId?: string;
  }
}

export function isValidGa4Id(id: string): boolean {
  return /^G-[A-Z0-9]{6,15}$/i.test((id || "").trim());
}

export function normalizeGa4Id(id: string): string {
  return (id || "").trim().toUpperCase();
}

export function getEnvGa4MeasurementId(): string {
  try {
    const envVal = (import.meta as any)?.env?.VITE_GA_MEASUREMENT_ID || "";
    const normalized = normalizeGa4Id(envVal);
    if (isValidGa4Id(normalized)) return normalized;
  } catch {}
  return "";
}

export function getGa4MeasurementIdSync(): string {
  const envId = getEnvGa4MeasurementId();
  if (envId) return envId;

  if (typeof window !== "undefined") {
    try {
      const saved = normalizeGa4Id(localStorage.getItem(GA4_STORAGE_KEY) || "");
      if (isValidGa4Id(saved)) return saved;
    } catch {}
  }
  return "";
}

function injectGa4Script(measurementId: string): void {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if (!isValidGa4Id(measurementId)) return;

  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function gtag(...args: any[]) {
      window.dataLayer.push(args);
    };
  }

  if (window.__coreaGa4LoadedId === measurementId) {
    return;
  }

  const existingScript = document.querySelector<HTMLScriptElement>(
    `script[src*="googletagmanager.com/gtag/js?id=${measurementId}"]`
  );
  if (!existingScript) {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    document.head.appendChild(script);
  }

  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    send_page_view: false,
    anonymize_ip: true,
    cookie_flags: "SameSite=None;Secure",
  });
  window.__coreaGa4LoadedId = measurementId;
}

function broadcastGa4Change(id: string) {
  if (typeof window === "undefined") return;
  try {
    window.dispatchEvent(new CustomEvent("corea-ga4-updated", { detail: id }));
  } catch {}
}

/**
 * Initialize GA4 from VITE_GA_MEASUREMENT_ID, localStorage, or server /api/config/ga4
 */
export async function initGA4(): Promise<string> {
  const syncId = getGa4MeasurementIdSync();
  if (syncId) {
    injectGa4Script(syncId);
    broadcastGa4Change(syncId);
  }

  try {
    const res = await fetch("/api/config/ga4");
    if (res.ok) {
      const ct = res.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        const data = await res.json();
        const serverId = normalizeGa4Id(data?.measurementId || "");
        if (isValidGa4Id(serverId)) {
          try {
            localStorage.setItem(GA4_STORAGE_KEY, serverId);
          } catch {}
          injectGa4Script(serverId);
          broadcastGa4Change(serverId);
          return serverId;
        }
      }
    }
  } catch {}

  return syncId;
}

/**
 * Save or update GA4 Measurement ID from Admin Dashboard & persist across all visitors via server DB
 */
export async function saveGA4MeasurementId(rawId: string): Promise<{ ok: boolean; measurementId: string; error?: string }> {
  const cleaned = normalizeGa4Id(rawId);
  if (cleaned && !isValidGa4Id(cleaned)) {
    return { ok: false, measurementId: "", error: "올바른 GA4 측정 ID 형식(예: G-XXXXXXXXXX)이 아닙니다." };
  }

  if (typeof window !== "undefined") {
    try {
      if (cleaned) {
        localStorage.setItem(GA4_STORAGE_KEY, cleaned);
      } else {
        localStorage.removeItem(GA4_STORAGE_KEY);
        window.__coreaGa4LoadedId = undefined;
      }
    } catch {}
  }

  try {
    await fetch("/api/config/ga4", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ measurementId: cleaned }),
    });
  } catch {}

  if (cleaned) {
    injectGa4Script(cleaned);
    trackGA4PageView("home", "ko");
  }
  broadcastGa4Change(cleaned);
  return { ok: true, measurementId: cleaned };
}

/**
 * Track virtual SPA page_view in Google Analytics 4
 */
export function trackGA4PageView(page: string, language: string): void {
  if (typeof window === "undefined") return;
  const measurementId = getGa4MeasurementIdSync();
  if (!measurementId) return;

  injectGa4Script(measurementId);
  if (!window.gtag) return;

  const params = new URLSearchParams();
  if (page && page !== "home") params.set("page", page);
  if (language) params.set("lang", language);
  const query = params.toString();
  const pagePath = `/${query ? `?${query}` : ""}`;

  window.gtag("event", "page_view", {
    send_to: measurementId,
    page_title: typeof document !== "undefined" ? document.title : "Corea Labs",
    page_location: `https://corea-labs.com${pagePath}`,
    page_path: pagePath,
    language,
    content_group: page || "home",
  });
}

/**
 * Track custom engagement events (sharing, SEO IndexNow push, AI concierge, Q&A)
 */
export function trackGA4Event(eventName: string, params: Record<string, any> = {}): void {
  if (typeof window === "undefined") return;
  const measurementId = getGa4MeasurementIdSync();
  if (!measurementId) return;

  injectGa4Script(measurementId);
  if (!window.gtag) return;

  window.gtag("event", eventName, {
    send_to: measurementId,
    ...params,
  });
}

export function subscribeToGa4Status(callback: (id: string) => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = (e: Event) => {
    const ce = e as CustomEvent<string>;
    callback(ce.detail || getGa4MeasurementIdSync());
  };
  window.addEventListener("corea-ga4-updated", handler);
  return () => window.removeEventListener("corea-ga4-updated", handler);
}
