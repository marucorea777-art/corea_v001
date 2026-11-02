import { useState, useEffect, startTransition } from "react";
import { motion, AnimatePresence } from "motion/react";
import Navbar from "./components/Navbar";
import HomeView from "./components/HomeView";
import HeritageView from "./components/HeritageView";
import CultureView from "./components/CultureView";
import PlacesView from "./components/PlacesView";
import FestivalsView from "./components/FestivalsView";
import TravelView from "./components/TravelView";
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

function MainApp() {
  const [activeTab, setActiveTab] = useState<string>("home");
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

      {/* Humble, Clean and Artistic Footer */}
      <footer className="w-full bg-white border-t border-stone-200/50 py-8 md:py-10 text-stone-500 text-xs text-center">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & Philosophy */}
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => handleSetTab("home")}>
            <KoreaLogoIcon className="w-6 h-6" />
            <span className="font-display font-bold text-stone-900 tracking-tight"><Translate>Corea Labs</Translate></span>
            <span className="text-[10px] text-stone-400 font-mono">|  <Translate>Ancient Spirit, Future Vision</Translate></span>
          </div>

          {/* Live Global Visitor Counter Pill */}
          <div
            onClick={() => (isAdmin ? setShowAnalyticsModal(true) : setShowLoginModal(true))}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-900 text-white text-[11px] font-mono tabular-nums cursor-pointer hover:bg-stone-800 transition-colors shadow-2xs"
            title="클릭하여 실시간 국가별·유입경로별 통계 대시보드 열기"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <Activity className="w-3 h-3 text-amber-400" />
            <span>LIVE 방문자: <strong className="text-amber-300">{liveVisitorCount.total.toLocaleString()}명</strong></span>
            <span className="text-stone-400">|</span>
            <span>오늘: <strong className="text-emerald-300">+{liveVisitorCount.today.toLocaleString()}</strong></span>
          </div>

          {/* Quick tab jumper links & Admin portal trigger */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 justify-center font-medium">
            <button onClick={() => handleSetTab("home")} className="hover:text-stone-900 transition-colors cursor-pointer"><Translate>Corea</Translate></button>
            <button onClick={() => handleSetTab("heritage")} className="hover:text-stone-900 transition-colors cursor-pointer"><Translate>Heritage</Translate></button>
            <button onClick={() => handleSetTab("culture")} className="hover:text-stone-900 transition-colors cursor-pointer"><Translate>Culture</Translate></button>
            <button onClick={() => handleSetTab("places")} className="hover:text-stone-900 transition-colors cursor-pointer"><Translate>Places</Translate></button>
            <button onClick={() => handleSetTab("festivals")} className="hover:text-stone-900 transition-colors cursor-pointer"><Translate>Festivals</Translate></button>
            <button 
              onClick={() => setIsShareModalOpen(true)} 
              className="text-amber-600 hover:text-amber-800 transition-colors cursor-pointer font-medium flex items-center gap-1"
            >
              <span>🌐</span> <Translate>공유 & 친구 초대</Translate>
            </button>
            <span className="text-stone-300">|</span>
            {isAdmin ? (
              <div className="flex items-center gap-2 bg-amber-50/90 border border-amber-300/80 px-2.5 py-1 rounded-full text-xs">
                <button 
                  onClick={() => setShowAnalyticsModal(true)} 
                  className="text-amber-900 hover:text-amber-950 transition-colors cursor-pointer font-bold flex items-center gap-1.5"
                  title="방문자 수 및 국가별 통계"
                >
                  <BarChart3 className="w-3.5 h-3.5 text-amber-600" />
                  <Translate>방문자 통계</Translate>
                </button>
                <span className="text-amber-300">|</span>
                <button 
                  onClick={logout} 
                  className="text-stone-500 hover:text-red-600 transition-colors cursor-pointer flex items-center gap-1"
                  title="관리자 로그아웃"
                >
                  <LogOut className="w-3 h-3" />
                  <Translate>관리자 로그아웃</Translate>
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowLoginModal(true)} 
                className="inline-flex items-center gap-1.5 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer text-xs px-2.5 py-1 rounded-full hover:bg-stone-100 border border-stone-200/80 bg-stone-50"
                title="관리자 로그인 (명소/축제 등록 및 통계)"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
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
