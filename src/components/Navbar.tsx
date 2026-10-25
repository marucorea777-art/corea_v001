import { useState, useEffect } from "react";
import { Compass, BookOpen, Utensils, MapPin, CalendarDays, PlaneLanding, ChevronDown, Share2 } from "lucide-react";
import { motion } from "motion/react";
import { useTranslation, LANGUAGES, LanguageCode, Translate } from "../context/LanguageContext";
import KoreaLogoIcon from "./KoreaLogoIcon";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenShareModal?: () => void;
}

export default function Navbar({ activeTab, setActiveTab, onOpenShareModal }: NavbarProps) {
  const { language, setLanguage, t } = useTranslation();
  const [langOpen, setLangOpen] = useState(false);

  // Real-time Seoul Live Clock (Asia/Seoul timezone, updated every second)
  const [seoulTime, setSeoulTime] = useState<string>(() => {
    try {
      return new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Seoul",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }).format(new Date());
    } catch {
      return "10:00:00 AM";
    }
  });

  useEffect(() => {
    const updateTime = () => {
      try {
        const formatted = new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Seoul",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }).format(new Date());
        setSeoulTime(formatted);
      } catch {}
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { id: "home", label: "Corea", icon: Compass },
    { id: "heritage", label: "Heritage", icon: BookOpen },
    { id: "culture", label: "Culture", icon: Utensils },
    { id: "places", label: "Places", icon: MapPin },
    { id: "festivals", label: "Festivals", icon: CalendarDays },
    { id: "travel", label: "Guide", icon: PlaneLanding },
  ];

  const currentLangObj = LANGUAGES.find((l) => l.code === language);

  return (
    <>
      {/* Desktop Top Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 hidden md:block bg-white/75 backdrop-blur-xl border-b border-stone-200/50">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <button 
            onClick={() => setActiveTab("home")}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <KoreaLogoIcon className="w-8 h-8 group-hover:scale-105 transition-transform" />
            <div className="flex flex-col text-left">
              <span className="font-display font-bold text-stone-900 tracking-tight leading-none">COREA LABS</span>
              <span className="text-[10px] text-stone-500 font-mono tracking-widest uppercase mt-0.5">Heritage Studio</span>
            </div>
          </button>

          <nav className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-full border border-stone-200/40">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative px-4 py-2 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    isActive ? "text-stone-900" : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute inset-0 bg-white shadow-sm border border-stone-200/20 rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5" />
                    {t(item.label)}
                  </span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            {/* Global Promotion & Share Button */}
            {onOpenShareModal && (
              <button
                onClick={onOpenShareModal}
                title="Share corea-labs.com with travelers worldwide"
                className="flex items-center gap-1.5 px-3 py-1.5 border border-stone-200/90 bg-white hover:bg-stone-50 text-stone-700 hover:text-stone-900 transition-colors text-xs font-medium rounded-full cursor-pointer shadow-2xs whitespace-nowrap shrink-0"
              >
                <Share2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="text-[11px] font-semibold whitespace-nowrap"><Translate>공유 & 초대</Translate></span>
              </button>
            )}

            {/* Premium Language Dropdown */}
            <div className="relative shrink-0">
              <button 
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-stone-200/80 bg-white hover:bg-stone-50 transition-colors text-xs font-medium text-stone-700 rounded-full cursor-pointer shadow-2xs whitespace-nowrap shrink-0"
              >
                <span className="shrink-0">{currentLangObj?.flag}</span>
                <span className="font-sans text-[11px] font-medium text-stone-800 whitespace-nowrap">{currentLangObj?.nativeName}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-200 shrink-0 ${langOpen ? "rotate-180" : ""}`} />
              </button>
              
              {langOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-stone-200/80 rounded-xl shadow-lg py-1.5 z-50 max-h-80 overflow-y-auto">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setLangOpen(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-xs hover:bg-stone-50 transition-colors cursor-pointer ${
                          language === lang.code ? "bg-stone-50 font-semibold text-stone-900" : "text-stone-600"
                        }`}
                      >
                        <span className="text-base shrink-0">{lang.flag}</span>
                        <div className="flex flex-col">
                          <span className="font-medium leading-none whitespace-nowrap">{lang.nativeName}</span>
                          <span className="text-[9px] text-stone-400 mt-0.5">{lang.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Real-time Live Seoul Clock */}
            <div 
              className="flex items-center gap-2 text-stone-600 font-mono text-[10px] border border-stone-200 bg-stone-50/90 px-3 py-1.5 rounded-full shadow-2xs whitespace-nowrap shrink-0"
              title="대한민국 서울 실시간 시각 (KST, UTC+9)"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="font-semibold whitespace-nowrap">SEOUL {seoulTime}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Top Header with Language Selector & Admin Button */}
      <header className="fixed top-0 left-0 right-0 z-50 md:hidden bg-white/75 backdrop-blur-xl border-b border-stone-200/50 h-14 flex items-center justify-between px-4">
        <button 
          onClick={() => setActiveTab("home")}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <KoreaLogoIcon className="w-6 h-6" />
          <span className="font-display font-bold text-stone-900 tracking-tight text-xs">COREA LABS</span>
        </button>
        
        <div className="flex items-center gap-1.5">
          {/* Mobile Share & Promote Button */}
          {onOpenShareModal && (
            <button
              onClick={onOpenShareModal}
              className="p-1.5 rounded-full bg-amber-500 text-white cursor-pointer shadow-xs"
              title="Share corea-labs.com"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Mobile Language Selector Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 border border-stone-200 bg-white text-xs font-medium text-stone-700 rounded-full cursor-pointer shadow-2xs"
            >
              <span>{currentLangObj?.flag}</span>
              <span className="text-[10px] font-semibold uppercase">{currentLangObj?.code}</span>
              <ChevronDown className="w-3 h-3 text-stone-400" />
            </button>
          
          {langOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
              <div className="absolute right-0 mt-1.5 w-44 bg-white border border-stone-200/80 rounded-xl shadow-lg py-1.5 z-50 max-h-72 overflow-y-auto">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setLangOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs hover:bg-stone-50 transition-colors cursor-pointer ${
                      language === lang.code ? "bg-stone-50 font-semibold text-stone-900" : "text-stone-600"
                    }`}
                  >
                    <span className="text-sm">{lang.flag}</span>
                    <div className="flex flex-col">
                      <span className="font-medium leading-none text-[11px]">{lang.nativeName}</span>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navbar */}
      <nav className="fixed bottom-4 left-4 right-4 z-50 md:hidden bg-white/90 backdrop-blur-xl border border-stone-200/80 rounded-2xl shadow-xl flex items-center justify-around px-3 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="relative py-1.5 px-3 flex flex-col items-center gap-1 cursor-pointer"
            >
              <div className={`p-1.5 rounded-xl transition-colors ${
                isActive ? "bg-stone-900 text-white" : "text-stone-500 hover:text-stone-900"
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-[9px] font-medium tracking-tight ${
                isActive ? "text-stone-900 font-semibold" : "text-stone-500"
              }`}>
                {t(item.label)}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
