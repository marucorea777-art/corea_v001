import { useState, useEffect, startTransition } from "react";
import { motion, AnimatePresence } from "motion/react";
import Navbar from "./components/Navbar";
import HomeView from "./components/HomeView";
import HeritageView from "./components/HeritageView";
import CultureView from "./components/CultureView";
import PlacesView from "./components/PlacesView";
import FestivalsView from "./components/FestivalsView";
import TravelView from "./components/TravelView";
import LegalAndAboutViews from "./components/LegalAndAboutViews";
import { LanguageProvider, Translate, useTranslation } from "./context/LanguageContext";
import { AdminProvider, useAdmin } from "./context/AdminContext";
import AdminLoginModal from "./components/AdminLoginModal";
import AdminAnalyticsDashboard from "./components/AdminAnalyticsDashboard";
import GlobalShareModal from "./components/GlobalShareModal";
import KoreaLogoIcon from "./components/KoreaLogoIcon";
import {
  trackPageView,
  fetchAnalyticsStats,
  subscribeToAnalyticsUpdates,
  startGlobalCampaignStream
} from "./services/analytics";
import { ShieldCheck, BarChart3, LogOut, Activity } from "lucide-react";

function getInitialTabFromUrl(): string {
  if (typeof window === "undefined") return "home";
  try {
    const pathname = window.location.pathname.replace(/^\/+|\/+$/g, "").toLowerCase();
    if (["privacy", "terms", "about", "heritage", "culture", "places", "festivals", "travel"].includes(pathname)) {
      return pathname;
    }
    const params = new URLSearchParams(window.location.search);
    const pageParam = (params.get("page") || params.get("tab") || "").toLowerCase();
    if (["privacy", "terms", "about", "heritage", "culture", "places", "festivals", "travel"].includes(pageParam)) {
      return pageParam;
    }
  } catch {}
  return "home";
}

function MainApp() {
  const [activeTab, setActiveTab] = useState<string>(getInitialTabFromUrl);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [liveVisitorCount, setLiveVisitorCount] = useState<{ total: number; today: number }>({ total: 784, today: 216 });
  const { language } = useTranslation();
  const { isAdmin, setShowLoginModal, logout, showAnalyticsModal, setShowAnalyticsModal } = useAdmin();

  // Start background global campaign stream and subscribe to real-time updates
  useEffect(() => {
    fetchAnalyticsStats().then((s) => {
      if (s?.summary) {
        setLiveVisitorCount({ total: s.summary.totalVisits, today: s.summary.todayVisits });
      }
    });
    const stopStream = startGlobalCampaignStream();
    const unsubscribe = subscribeToAnalyticsUpdates((s) => {
      if (s?.summary) {
        setLiveVisitorCount({ total: s.summary.totalVisits, today: s.summary.todayVisits });
      }
    });
    return () => {
      stopStream();
      unsubscribe();
    };
  }, []);

  // Track page views and language selections
  useEffect(() => {
    trackPageView(activeTab, language);
  }, [activeTab, language]);

  const handleSetTab = (tab: string) => {
    startTransition(() => {
      setActiveTab(tab);
    });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case "home":
        return <HomeView setActiveTab={handleSetTab} onOpenShareModal={() => setIsShareModalOpen(true)} />;
      case "heritage":
        return <HeritageView />;
      case "culture":
        return <CultureView />;
      case "places":
        return <PlacesView />;
      case "festivals":
        return <FestivalsView />;
      case "travel":
        return <TravelView />;
      case "privacy":
        return <LegalAndAboutViews activePage="privacy" setActiveTab={handleSetTab} />;
      case "terms":
        return <LegalAndAboutViews activePage="terms" setActiveTab={handleSetTab} />;
      case "about":
        return <LegalAndAboutViews activePage="about" setActiveTab={handleSetTab} />;
      default:
        return <HomeView setActiveTab={handleSetTab} onOpenShareModal={() => setIsShareModalOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col justify-between font-sans selection:bg-amber-100 selection:text-stone-900">
      
      {/* Premium Header/Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={handleSetTab} onOpenShareModal={() => setIsShareModalOpen(true)} />

      {/* Main Content Arena with fluid, desktop-precision containers */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 pt-20 pb-28 md:pt-26 md:pb-12 flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="w-full"
          >
            {renderActiveView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Humble, Clean and Artistic Footer (Google AdSense Compliant Legal & About Links) */}
      <footer className="w-full bg-white border-t border-stone-200/70 py-6 md:py-7 text-stone-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* 1. Left: Logo & Philosophy */}
          <div
            className="flex items-center gap-2 cursor-pointer group shrink-0 whitespace-nowrap"
            onClick={() => handleSetTab("home")}
          >
            <KoreaLogoIcon className="w-6 h-6 shrink-0" />
            <span className="font-display font-bold text-stone-900 tracking-tight"><Translate>Corea Labs</Translate></span>
            <span className="text-stone-300">|</span>
            <span className="text-[11px] text-stone-400 font-mono"><Translate>Ancient Spirit, Future Vision</Translate></span>
          </div>

          {/* 2. Center: Legal, Policy & About Menu (Google AdSense Required Links) */}
          <nav
            aria-label="Footer Legal and About Navigation"
            className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium"
          >
            <button
              onClick={() => handleSetTab("privacy")}
              className={`inline-flex items-center leading-none whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === "privacy"
                  ? "text-stone-950 font-bold underline underline-offset-4"
                  : "text-stone-700 hover:text-stone-950 font-semibold"
              }`}
            >
              <Translate>개인정보처리방침 (Privacy Policy)</Translate>
            </button>
            <span className="h-3 w-px bg-stone-200 hidden sm:inline-block" aria-hidden="true" />
            <button
              onClick={() => handleSetTab("terms")}
              className={`inline-flex items-center leading-none whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === "terms"
                  ? "text-stone-950 font-bold underline underline-offset-4"
                  : "text-stone-600 hover:text-stone-950"
              }`}
            >
              <Translate>이용약관 (Terms)</Translate>
            </button>
            <span className="h-3 w-px bg-stone-200 hidden sm:inline-block" aria-hidden="true" />
            <button
              onClick={() => handleSetTab("about")}
              className={`inline-flex items-center leading-none whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === "about"
                  ? "text-stone-950 font-bold underline underline-offset-4"
                  : "text-stone-600 hover:text-stone-950"
              }`}
            >
              <Translate>사이트 소개 (About)</Translate>
            </button>
          </nav>

          {/* 3. Right: Live Global Visitor Counter & Admin Trigger */}
          <div className="flex flex-wrap items-center justify-center gap-2 shrink-0">
            <div
              onClick={() => (isAdmin ? setShowAnalyticsModal(true) : setShowLoginModal(true))}
              className="inline-flex items-center gap-2 h-7 px-3 rounded-full bg-stone-900 text-white text-[11px] font-mono tabular-nums cursor-pointer hover:bg-stone-800 transition-colors shadow-2xs whitespace-nowrap"
              title="클릭하여 실시간 국가별·유입경로별 통계 대시보드 열기"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <Activity className="w-3 h-3 text-amber-400 shrink-0" />
              <span>LIVE 방문자: <strong className="text-amber-300">{liveVisitorCount.total.toLocaleString()}명</strong></span>
              <span className="text-stone-500">|</span>
              <span>오늘: <strong className="text-emerald-300">+{liveVisitorCount.today.toLocaleString()}</strong></span>
            </div>

            {isAdmin ? (
              <div className="inline-flex items-center gap-2 h-7 bg-amber-50/90 border border-amber-300/80 px-3 rounded-full text-xs whitespace-nowrap">
                <button 
                  onClick={() => setShowAnalyticsModal(true)} 
                  className="text-amber-900 hover:text-amber-950 transition-colors cursor-pointer font-bold inline-flex items-center gap-1.5 leading-none"
                  title="방문자 수 및 국가별 통계"
                >
                  <BarChart3 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <Translate>방문자 통계</Translate>
                </button>
                <span className="h-3 w-px bg-amber-300" />
                <button 
                  onClick={logout} 
                  className="text-stone-500 hover:text-red-600 transition-colors cursor-pointer inline-flex items-center gap-1 leading-none"
                  title="관리자 로그아웃"
                >
                  <LogOut className="w-3 h-3 shrink-0" />
                  <Translate>로그아웃</Translate>
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowLoginModal(true)} 
                className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200/90 bg-stone-50 transition-colors cursor-pointer text-xs font-medium whitespace-nowrap leading-none"
                title="관리자 로그인 (명소/축제 등록 및 통계)"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <Translate>관리자 로그인</Translate>
              </button>
            )}
          </div>

        </div>
      </footer>

      {/* Global Share & Promote Modal */}
      <GlobalShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
      />

      {/* Admin Analytics Dashboard */}
      <AdminAnalyticsDashboard
        isOpen={showAnalyticsModal}
        onClose={() => setShowAnalyticsModal(false)}
        onOpenPromote={() => {
          setShowAnalyticsModal(false);
          setIsShareModalOpen(true);
        }}
      />

      {/* Global Admin Login Modal */}
      <AdminLoginModal />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AdminProvider>
        <MainApp />
      </AdminProvider>
    </LanguageProvider>
  );
}
