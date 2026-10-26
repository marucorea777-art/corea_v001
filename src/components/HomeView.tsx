import { motion } from "motion/react";
import { ArrowUpRight, Award, Compass, Heart, History, Sparkles, ChevronRight, Zap, Globe, Share2, QrCode, Copy, Check } from "lucide-react";
import { useState } from "react";
import { DESTINATIONS, FESTIVALS, HERITAGE_ITEMS, HANGUL_CONCEPTS } from "../data";
import { useTranslatedData, useTranslation, Translate } from "../context/LanguageContext";

import seoulSkylineHeroImg from "../assets/images/seoul_skyline_hero_1784268876066.jpg";
import hanbokCourtImg from "../assets/images/hanbok_court_1784268718628.jpg";

interface HomeViewProps {
  setActiveTab: (tab: string) => void;
  onOpenShareModal?: () => void;
}

export default function HomeView({ setActiveTab, onOpenShareModal }: HomeViewProps) {
  const { language, t } = useTranslation();
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Dynamic Translation of core highlight spots
  const { translatedData: translatedFestivals } = useTranslatedData(FESTIVALS, ["name", "description", "location", "dateRange", "season", "highlight", "features"]);
  const { translatedData: translatedDestinations } = useTranslatedData(DESTINATIONS, ["name", "tagline", "description", "highlights", "locationLabel"]);
  const { translatedData: translatedHeritage } = useTranslatedData(HERITAGE_ITEMS, ["name", "description", "period", "keyHighlight", "category"]);
  const { translatedData: translatedConcepts } = useTranslatedData(HANGUL_CONCEPTS, ["meaning", "poeticDescription"]);

  const highlightFestival = translatedFestivals[0] || FESTIVALS[0]; 
  const highlightPlace = translatedDestinations[2] || DESTINATIONS[2]; 
  const highlightHeritage = translatedHeritage[0] || HERITAGE_ITEMS[0]; 
  const wordConcept = translatedConcepts[0] || HANGUL_CONCEPTS[0];

  const handleQuizSubmit = (idx: number) => {
    if (quizSubmitted) return;
    setQuizAnswer(idx);
    setQuizSubmitted(true);
  };

  const handleResetQuiz = () => {
    setQuizAnswer(null);
    setQuizSubmitted(false);
  };

  return (
    <div className="space-y-12">
      {/* Immersive Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-stone-950 text-white p-8 md:p-16 flex flex-col justify-end min-h-[440px] md:min-h-[520px] shadow-2xl border border-stone-800">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity" 
          style={{ backgroundImage: `url(${seoulSkylineHeroImg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/25 px-3 py-1 rounded-full text-xs font-mono tracking-wider text-amber-300 uppercase">
            <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
            <Translate>Where Ancient Spirit Meets Future Vision</Translate>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight leading-none text-white">
            <Translate>Redefining the</Translate> <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-stone-200 to-teal-200">
              <Translate>Next Heritage</Translate>
            </span>
          </h1>
          
          <p className="text-sm md:text-base text-stone-300 font-sans leading-relaxed">
            <Translate>Welcome to Corea Labs. An interactive laboratory exploring Korea's eternal traditions, five grand royal palaces, vibrant festivals, and deep-rooted philosophy, connected with cutting-edge futuristic smart technology.</Translate>
          </p>

          <div className="flex flex-wrap gap-3 pt-4">
            <button
              onClick={() => setActiveTab("heritage")}
              className="px-5 py-2.5 rounded-full bg-white text-stone-950 text-xs font-semibold hover:bg-stone-100 transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg"
            >
              <Translate>Explore Eternal Heritage</Translate>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveTab("culture")}
              className="px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold hover:bg-white/20 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Translate>Discover Living Culture</Translate>
            </button>
          </div>
        </div>
      </section>

      {/* Core Statistics Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "UNESCO Sites", value: "16", desc: "World Heritage Sites", icon: Award, color: "text-amber-600" },
          { label: "Dynasty History", value: "5,000+", desc: "Years of Cultural Continuity", icon: History, color: "text-teal-600" },
          { label: "National Treasures", value: "300+", desc: "Officially Designated Artifacts", icon: Heart, color: "text-red-500" },
          { label: "Digital Innovation", value: "#1", desc: "Hyper-Connected Smart Nation", icon: Zap, color: "text-blue-500" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-5 rounded-2xl border border-stone-200/60 shadow-xs flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono tracking-widest text-stone-400 uppercase">
                  <Translate>{stat.label}</Translate>
                </span>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div className="mt-4">
                <span className="text-2xl md:text-3xl font-display font-bold text-stone-900 leading-none">{stat.value}</span>
                <p className="text-[11px] text-stone-500 font-sans mt-1">
                  <Translate>{stat.desc}</Translate>
                </p>
              </div>
            </motion.div>
          );
        })}
      </section>

      {/* Dokdo Island Special Spotlight Section */}
      <section className="bg-gradient-to-r from-stone-900 to-stone-950 text-white rounded-3xl p-6 md:p-8 border border-stone-800 shadow-xl relative overflow-hidden flex flex-col md:flex-row gap-6 items-center">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="md:w-1/3 w-full h-48 rounded-2xl overflow-hidden relative shadow-md shrink-0">
          <img
            src={translatedHeritage.find(h => h.id === "dokdo-island")?.image || HERITAGE_ITEMS.find(h => h.id === "dokdo-island")?.image}
            alt="Dokdo Island"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
          <span className="absolute top-3 left-3 text-[9px] font-mono tracking-widest uppercase bg-teal-600 text-white px-2.5 py-0.5 rounded-full font-bold">
            <Translate>Sovereign Natural Heritage</Translate>
          </span>
        </div>

        <div className="md:w-2/3 w-full space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-teal-500/10 text-teal-300 border border-teal-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider">
            <Translate>Korea's Easternmost Boundary</Translate>
          </div>
          <h2 className="text-xl md:text-2xl font-display font-bold tracking-tight text-white">
            <Translate>Dokdo: The Beautiful Island of Korea</Translate>
          </h2>
          <p className="text-xs text-stone-300 leading-relaxed font-sans font-normal">
            <Translate>First integrated into Korean territory in 512 AD by Silla Dynasty General Isabu, Dokdo has stood as an integral part of the Korean nation for over 1,500 years. This majestic volcanic island in the East Sea (Natural Monument No. 336) is renowned for its incredible marine biodiversity, towering basalt structures, and its timeless significance as a symbol of Korean sovereignty and natural majesty.</Translate>
          </p>
          <div className="pt-2 flex items-center gap-4">
            <button
              onClick={() => setActiveTab("heritage")}
              className="text-xs text-teal-300 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Translate>Explore Natural Monument details</Translate>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Bento Layout: Living Culture, Curated Destinations & Festivals */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Culture Teaser Card */}
        <div className="md:col-span-2 bg-white rounded-3xl border border-stone-200/60 overflow-hidden shadow-xs flex flex-col justify-between group">
          <div className="relative h-48 md:h-64 overflow-hidden">
            <img
              src={hanbokCourtImg}
              alt="Traditional Korea Hanbok"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="text-[9px] font-mono tracking-widest uppercase bg-amber-500 text-stone-950 px-2 py-0.5 rounded-full font-bold">
                <Translate>LIVING CULTURE</Translate>
              </span>
              <h3 className="text-xl font-display font-bold tracking-tight mt-1"><Translate>The Pulse of Korea</Translate></h3>
              <p className="text-xs text-stone-300">
                <Translate>From exquisite gastronomy (Hansik) to Hanbok crafts and hyper-tech robotics.</Translate>
              </p>
            </div>
          </div>
          <div className="p-5 flex items-center justify-between bg-stone-50 border-t border-stone-100">
            <span className="text-xs text-stone-600 font-medium">
              <Translate>Explore pottery, kimchi, K-Pop & global influences</Translate>
            </span>
            <button
              onClick={() => setActiveTab("culture")}
              className="flex items-center gap-1 text-xs font-semibold text-stone-950 hover:underline cursor-pointer"
            >
              <Translate>Learn More</Translate>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Featured Artifact Small Box */}
        <div className="bg-stone-900 text-white rounded-3xl p-6 flex flex-col justify-between border border-stone-800 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl" />
          <div className="space-y-4">
            <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase"><Translate>Artifact Spotlight</Translate></span>
            <h4 className="text-lg font-display font-semibold tracking-tight">{t(highlightHeritage.name)}</h4>
            <p className="text-xs text-stone-300 font-sans leading-relaxed line-clamp-4">
              {t(highlightHeritage.description)}
            </p>
          </div>
          <div className="pt-6 border-t border-stone-800 flex items-center justify-between">
            <span className="text-[10px] text-stone-400 font-mono">{t(highlightHeritage.period)}</span>
            <button 
              onClick={() => setActiveTab("heritage")}
              className="text-xs text-amber-300 font-semibold hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <Translate>View Artifacts</Translate>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Trivia & Word of the Day Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Daily trivia */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/60 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
                <Compass className="w-4 h-4" />
              </span>
              <h3 className="font-display font-semibold text-stone-900"><Translate>Corea Labs Interactive Trivia</Translate></h3>
            </div>
            <p className="text-xs font-medium text-stone-700 leading-relaxed">
              <Translate>Which Korean King commissioned the phonetic alphabet 'Hangeul' in 1443 to increase literacy among commoners?</Translate>
            </p>

            <div className="space-y-2 pt-2">
              {[
                "King Taejo",
                "King Sejong the Great",
                "King Yeongjo",
                "King Gojong"
              ].map((option, idx) => {
                let btnStyle = "bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-800";
                if (quizSubmitted) {
                  if (idx === 1) { // King Sejong the Great is index 1
                    btnStyle = "bg-emerald-50 border-emerald-300 text-emerald-800 font-medium";
                  } else if (idx === quizAnswer) {
                    btnStyle = "bg-rose-50 border-rose-200 text-rose-700";
                  } else {
                    btnStyle = "bg-stone-50/50 border-stone-100 text-stone-400 cursor-not-allowed";
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={quizSubmitted}
                    onClick={() => handleQuizSubmit(idx)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl border text-xs transition-all duration-200 flex items-center justify-between ${btnStyle} cursor-pointer`}
                  >
                    <span><Translate>{option}</Translate></span>
                    {quizSubmitted && idx === 1 && (
                      <span className="text-[10px] font-mono bg-emerald-500 text-white px-1.5 py-0.5 rounded-sm">
                        <Translate>Correct</Translate>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {quizSubmitted && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4 pt-4 border-t border-stone-100 space-y-3"
            >
              <p className="text-xs text-stone-600 leading-relaxed italic bg-amber-50/50 p-3 rounded-lg border border-amber-200/35">
                <Translate>King Sejong the Great commissioned Hunminjeongeum in 1443. He declared that the common people needed a phonetic script that could be learned easily in a single morning, replacing complex classical Chinese characters.</Translate>
              </p>
              <button
                onClick={handleResetQuiz}
                className="text-xs font-mono font-medium text-stone-900 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-md transition-colors cursor-pointer"
              >
                <Translate>Reset Trivia</Translate>
              </button>
            </motion.div>
          )}
        </div>

        {/* Word of the day */}
        <div className="bg-stone-50 rounded-3xl p-6 border border-stone-200/40 shadow-2xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono tracking-widest text-stone-400 uppercase"><Translate>Core Philosophy</Translate></span>
              <span className="text-xs bg-stone-900 text-stone-100 px-2.5 py-0.5 rounded-full font-mono"><Translate>Word of the Day</Translate></span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-display font-bold text-stone-900">{HANGUL_CONCEPTS[0].hangul}</span>
              <span className="text-sm font-mono text-stone-500">[{HANGUL_CONCEPTS[0].romanization}]</span>
              <span className="text-xs font-medium text-amber-700 bg-amber-100/50 px-2 py-0.5 rounded-full border border-amber-200/30">
                {t(wordConcept.meaning)}
              </span>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed font-sans">
              {t(wordConcept.poeticDescription)}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-stone-200/60 flex items-center justify-between">
            <span className="text-[10px] text-stone-400 font-mono"><Translate>Curated from Korea's Soul</Translate></span>
            <button
              onClick={() => setActiveTab("culture")}
              className="text-xs text-stone-900 font-semibold hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <Translate>Explore Concepts</Translate>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Curated Destination & Festival Small highlights */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Destination spotlight */}
        <div className="bg-white rounded-3xl overflow-hidden border border-stone-200/60 shadow-xs flex flex-col md:flex-row">
          <div className="md:w-2/5 h-40 md:h-auto relative">
            <img
              src={highlightPlace.coverImage}
              alt={highlightPlace.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <span className="absolute bottom-2 left-2 text-[9px] font-mono text-white bg-black/40 px-2 py-0.5 rounded-full">
              <Translate>{highlightPlace.locationLabel}</Translate>
            </span>
          </div>
          <div className="p-5 md:w-3/5 flex flex-col justify-between space-y-4">
            <div className="space-y-1">
              <span className="text-[9px] font-mono text-teal-600 font-bold uppercase tracking-wider"><Translate>Destination Highlight</Translate></span>
              <h4 className="text-base font-display font-bold text-stone-900 flex items-center gap-1.5">
                {language === "ko" ? (
                  <>
                    <span>{highlightPlace.koreanName || t(highlightPlace.name)}</span>
                    {highlightPlace.name && highlightPlace.name !== highlightPlace.koreanName && (
                      <span className="text-xs font-sans text-stone-400 font-normal">({highlightPlace.name})</span>
                    )}
                  </>
                ) : (
                  <>
                    <span>{t(highlightPlace.name)}</span>
                    {highlightPlace.koreanName && (
                      <span className="text-xs font-sans text-stone-400 font-normal">({highlightPlace.koreanName})</span>
                    )}
                  </>
                )}
              </h4>
              <p className="text-xs text-stone-500 line-clamp-3 leading-relaxed">
                {t(highlightPlace.description)}
              </p>
            </div>
            <button
              onClick={() => setActiveTab("places")}
              className="w-fit text-xs font-semibold text-stone-900 border-b border-stone-900 pb-0.5 hover:text-stone-600 hover:border-stone-400 transition-colors cursor-pointer"
            >
              <Translate>Browse Curated Travel Guides</Translate>
            </button>
          </div>
        </div>

        {/* Festival spotlight */}
        <div className="bg-white rounded-3xl overflow-hidden border border-stone-200/60 shadow-xs flex flex-col md:flex-row">
          <div className="md:w-2/5 h-40 md:h-auto relative">
            <img
              src={highlightFestival.image}
              alt={highlightFestival.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <span className="absolute bottom-2 left-2 text-[9px] font-mono text-white bg-amber-600 px-2 py-0.5 rounded-full font-bold">
              <Translate>{highlightFestival.season}</Translate>
            </span>
          </div>
          <div className="p-5 md:w-3/5 flex flex-col justify-between space-y-4">
            <div className="space-y-1">
              <span className="text-[9px] font-mono text-amber-600 font-bold uppercase tracking-wider"><Translate>Festival Highlight</Translate></span>
              <h4 className="text-base font-display font-bold text-stone-900 flex items-center gap-1.5">
                {language === "ko" ? (
                  <>
                    <span>{highlightFestival.koreanName || t(highlightFestival.name)}</span>
                    {highlightFestival.name && highlightFestival.name !== highlightFestival.koreanName && (
                      <span className="text-xs font-sans text-stone-400 font-normal">({highlightFestival.name})</span>
                    )}
                  </>
                ) : (
                  <>
                    <span>{t(highlightFestival.name)}</span>
                    {highlightFestival.koreanName && (
                      <span className="text-xs font-sans text-stone-400 font-normal">({highlightFestival.koreanName})</span>
                    )}
                  </>
                )}
              </h4>
              <p className="text-xs text-stone-500 line-clamp-3 leading-relaxed">
                {t(highlightFestival.description)}
              </p>
            </div>
            <button
              onClick={() => setActiveTab("festivals")}
              className="w-fit text-xs font-semibold text-stone-900 border-b border-stone-900 pb-0.5 hover:text-stone-600 hover:border-stone-400 transition-colors cursor-pointer"
            >
              <Translate>View Seasonal Event Calendars</Translate>
            </button>
          </div>
        </div>
      </section>

      {/* Global Traveler Promotion & Viral Hub for corea-labs.com */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-stone-900 via-stone-800 to-stone-950 text-white p-8 md:p-12 border border-stone-800 shadow-xl">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay"
          style={{ backgroundImage: `url(${seoulSkylineHeroImg})` }}
        />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-8 space-y-4 text-left">
            <div className="inline-flex items-center gap-2 bg-amber-400/15 border border-amber-400/30 px-3.5 py-1 rounded-full text-xs font-mono font-medium text-amber-300">
              <Globe className="w-3.5 h-3.5 animate-pulse" />
              <span>corea-labs.com</span>
              <span className="text-stone-400">•</span>
              <span className="text-[11px]"><Translate>Global Travel Discovery</Translate></span>
            </div>

            <h3 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight leading-snug">
              <Translate>Traveling to Korea or Know Someone Who Is?</Translate> <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-stone-200 to-teal-300">
                <Translate>Share corea-labs.com with Fellow Travelers!</Translate>
              </span>
            </h3>

            <p className="text-xs md:text-sm text-stone-300 font-sans leading-relaxed max-w-2xl">
              <Translate>corea-labs.com is the free international guide to South Korea's authentic seasonal festivals, 5 grand royal palaces, UNESCO world heritage, and local cultural secrets — translated into 11 languages with 24/7 travel tips.</Translate>
            </p>

            {/* Quick Feature Badges for Foreigners */}
            <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-mono text-stone-300">
              <span className="px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-xs border border-white/15">
                🌐 11 Languages
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-xs border border-white/15">
                🏮 25+ Real Festivals
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-xs border border-white/15">
                📱 Zero App Install Needed
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-xs border border-white/15">
                📞 1330 Korea Helpline
              </span>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-3">
            {/* Direct Open Share Modal Button */}
            {onOpenShareModal && (
              <button
                onClick={onOpenShareModal}
                className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg hover:scale-[1.02]"
              >
                <Share2 className="w-4 h-4" />
                <span><Translate>Share & Invite Friends (WhatsApp, X, Reddit)</Translate></span>
              </button>
            )}

            {/* Quick URL Copy Box with Feedback */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-2.5 flex items-center justify-between gap-2">
              <span className="font-mono text-xs text-amber-200 truncate pl-2 select-all">
                https://corea-labs.com
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText("https://corea-labs.com");
                  setCopiedUrl(true);
                  setTimeout(() => setCopiedUrl(false), 2500);
                }}
                className="px-3 py-1.5 rounded-xl bg-white text-stone-900 text-xs font-semibold flex items-center gap-1.5 hover:bg-stone-100 transition-colors cursor-pointer shrink-0"
              >
                {copiedUrl ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span><Translate>Copied!</Translate></span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span><Translate>Copy Link</Translate></span>
                  </>
                )}
              </button>
            </div>

            {/* Mobile Scan QR trigger */}
            {onOpenShareModal && (
              <button
                onClick={onOpenShareModal}
                className="w-full py-2 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer border border-white/10"
              >
                <QrCode className="w-3.5 h-3.5 text-amber-300" />
                <span><Translate>Show Phone QR Code for Group Scanning</Translate></span>
              </button>
            )}
          </div>

        </div>
      </section>
    </div>
  );
}
