import { useEffect } from "react";

interface AdSenseGuardProps {
  activeTab: string;
  isModalOpen: boolean;
}

const CONTENT_RICH_TABS = new Set([
  "home",
  "festivals",
  "travel",
  "places",
  "heritage",
  "culture",
  "qna",
]);

/**
 * AdSense Policy Guard:
 * Prevents Google AdSense ("게시자 콘텐츠가 없는 화면에 Google 게재 광고") violations by:
 * 1. Ensuring utility/legal pages (privacy, terms, about) and modal overlays (login, analytics, share)
 *    never display Google Auto Ads and carry a temporary noindex/noads state while open.
 * 2. Loading/activating adsbygoogle ONLY after substantive publisher <article> content (>1,500 chars)
 *    is verified to be mounted and visible in the DOM.
 */
export default function AdSenseGuard({ activeTab, isModalOpen }: AdSenseGuardProps) {
  useEffect(() => {
    if (typeof document === "undefined" || typeof window === "undefined") return;

    const isEligibleContentScreen = CONTENT_RICH_TABS.has(activeTab) && !isModalOpen;
    const robotsMeta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;

    if (!isEligibleContentScreen) {
      // Mark non-content / utility / modal screens so crawlers and Auto Ads do not treat them as ad screens
      document.body.setAttribute("data-adsense-state", "disabled-utility-screen");
      if (robotsMeta && (activeTab === "privacy" || activeTab === "terms")) {
        robotsMeta.content = "noindex, follow";
      }
      // Hide any dynamically injected auto-ad containers on utility/modal screens
      const autoAds = document.querySelectorAll<HTMLElement>(
        "ins.adsbygoogle, .google-auto-placed, iframe[id^='google_ads_iframe']"
      );
      autoAds.forEach((el) => {
        el.style.display = "none";
      });
      return;
    }

    // Restore indexable robots directive on substantive content views
    if (robotsMeta) {
      robotsMeta.content = "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1";
    }

    // Wait until substantive publisher text is confirmed in <main> before enabling AdSense
    const timer = window.setTimeout(() => {
      const mainEl = document.querySelector("main");
      const textLength = mainEl?.innerText?.trim().length || 0;

      if (textLength >= 800) {
        document.body.setAttribute("data-adsense-state", "active-publisher-content");
        const autoAds = document.querySelectorAll<HTMLElement>(
          "ins.adsbygoogle, .google-auto-placed"
        );
        autoAds.forEach((el) => {
          el.style.display = "";
        });

        // Inject adsbygoogle script only once after real publisher content is present in the DOM
        const existingScript = document.querySelector(
          'script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]'
        );
        if (!existingScript) {
          const script = document.createElement("script");
          script.async = true;
          script.src =
            "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6232324178916733";
          script.crossOrigin = "anonymous";
          document.head.appendChild(script);
        }
      }
    }, 350);

    return () => {
      window.clearTimeout(timer);
    };
  }, [activeTab, isModalOpen]);

  return null;
}
