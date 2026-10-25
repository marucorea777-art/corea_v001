import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, MapPin, Landmark, Calendar, Sparkles, ChevronRight, X, Clock, HelpCircle } from "lucide-react";
import { PALACES, HERITAGE_ITEMS, TIMELINE } from "../data";
import { Palace } from "../types";
import { useTranslatedData, useTranslation, Translate } from "../context/LanguageContext";

export default function HeritageView() {
  const { language, t } = useTranslation();
  const [selectedPalaceId, setSelectedPalaceId] = useState<string | null>(null);
  const [activeTimeline, setActiveTimeline] = useState<string>("joseon-dynasty");
  const [heritageCategory, setHeritageCategory] = useState<"All" | "Artifact" | "Architecture" | "Living Heritage" | "Natural Heritage">("All");

  // Translate static arrays on the fly
  const { translatedData: translatedPalaces, loading: loadingPalaces } = useTranslatedData(PALACES, [
    "name",
    "description",
    "keyHighlight",
    "detailedTips",
    "location"
  ]);

  const { translatedData: translatedHeritage, loading: loadingHeritage } = useTranslatedData(HERITAGE_ITEMS, [
    "name",
    "description",
    "keyHighlight",
    "period",
    "category"
  ]);

  const { translatedData: translatedTimeline, loading: loadingTimeline } = useTranslatedData(TIMELINE, [
    "title",
    "summary",
    "details"
  ]);

  const filteredHeritage = translatedHeritage.filter(
    item => heritageCategory === "All" || item.category === heritageCategory
  );

  const selectedPalace = translatedPalaces.find(p => p.id === selectedPalaceId) || null;

  return (
    <div className="space-y-12">
      {/* Immersive Header */}
      <section className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-950 border border-amber-200/50 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider">
          <BookOpen className="w-3 h-3 text-amber-700" />
          <Translate>The Spirit of the Peninsula</Translate>
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-stone-900">
          <Translate>Echoes of Time: Korea's Eternal Heritage</Translate>
        </h1>
        <p className="text-xs md:text-sm text-stone-500 font-sans leading-relaxed">
          <Translate>Traverse thousands of years of royal grandeur, mystical philosophy, and scientific masterpieces that define Korea's eternal legacy.</Translate>
        </p>
      </section>

      {/* The Five Grand Palaces Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-xl md:text-2xl font-display font-bold text-stone-900 tracking-tight flex items-center gap-2">
              <Landmark className="w-5 h-5 text-stone-800" />
              <Translate>The Five Grand Palaces</Translate>
            </h2>
            <p className="text-xs text-stone-500"><Translate>The royal residential complexes of the Joseon Dynasty in Seoul.</Translate></p>
          </div>
          <span className="text-[10px] font-mono tracking-widest text-stone-400 uppercase hidden md:inline">
            <Translate>Seoul, South Korea</Translate>
          </span>
        </div>

        {/* Palaces Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {translatedPalaces.map((palace) => (
            <motion.div
              key={palace.id}
              whileHover={{ y: -4 }}
              onClick={() => setSelectedPalaceId(palace.id)}
              className="bg-white rounded-2xl overflow-hidden border border-stone-200/60 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between h-72 group"
            >
              <div className="relative h-36 overflow-hidden">
                <img
                  src={palace.image}
                  alt={palace.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent" />
                <span className="absolute bottom-2.5 left-2.5 text-[9px] font-mono text-white bg-stone-900/40 px-2 py-0.5 rounded-sm">
                  <Translate>Founded</Translate> {palace.founded}
                </span>
              </div>
              
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 justify-between">
                    <h3 className="font-display font-bold text-stone-900 text-sm">{palace.name}</h3>
                    <span className="text-xs text-stone-400 font-medium font-sans">{palace.koreanName}</span>
                  </div>
                  <p className="text-[11px] text-stone-500 font-sans mt-1 line-clamp-3 leading-relaxed">
                    {palace.description}
                  </p>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                  <span className="text-[10px] font-mono text-amber-700 font-semibold uppercase"><Translate>View Details</Translate></span>
                  <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Treasures of the Kingdom Bento-grid */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl md:text-2xl font-display font-bold text-stone-900 tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <Translate>Treasures of the Kingdom</Translate>
            </h2>
            <p className="text-xs text-stone-500"><Translate>Designated masterpieces of artifact, architecture, and living history.</Translate></p>
          </div>

          {/* Categories Tab selector */}
          <div className="flex flex-wrap gap-1.5 bg-stone-100 p-1 rounded-lg border border-stone-200/40 w-fit">
            {(["All", "Artifact", "Architecture", "Living Heritage", "Natural Heritage"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setHeritageCategory(cat)}
                className={`px-3 py-1 rounded-md text-[10px] font-mono tracking-wider uppercase font-semibold transition-all cursor-pointer ${
                  heritageCategory === cat
                    ? "bg-white text-stone-950 shadow-2xs border border-stone-200/20"
                    : "text-stone-500 hover:text-stone-900"
                }`}
              >
                <Translate>{cat}</Translate>
              </button>
            ))}
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredHeritage.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                key={item.id}
                className="bg-white rounded-3xl border border-stone-200/60 overflow-hidden shadow-2xs flex flex-col md:flex-row"
              >
                <div className="md:w-2/5 h-48 md:h-auto relative min-h-[180px]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 text-[9px] font-mono tracking-widest uppercase bg-stone-950 text-stone-100 px-2 py-0.5 rounded-sm">
                    <Translate>{item.category}</Translate>
                  </span>
                </div>
                
                <div className="p-5 md:w-3/5 flex flex-col justify-between space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] text-stone-400 font-mono tracking-wide">{item.period}</span>
                    <h3 className="font-display font-bold text-stone-900 text-base">{item.name}</h3>
                    <p className="text-xs text-stone-500 leading-relaxed font-sans">{item.description}</p>
                  </div>
                  
                  <div className="pt-3 border-t border-stone-100/80 flex items-center justify-between text-[10px] font-mono text-stone-600 bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                    <span className="font-semibold text-stone-900 uppercase"><Translate>Core Highlight</Translate>:</span>
                    <span className="font-medium text-right text-stone-700">{item.keyHighlight}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Dynasty Timeline Section */}
      <section className="bg-stone-950 text-white rounded-3xl p-6 md:p-8 border border-stone-800 shadow-xl space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl" />

        <div className="space-y-1 relative z-10">
          <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase"><Translate>Interactive Chronicle</Translate></span>
          <h2 className="text-xl md:text-2xl font-display font-bold tracking-tight text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-400" />
            <Translate>Timeline of Kingdoms & Dynasties</Translate>
          </h2>
          <p className="text-xs text-stone-400"><Translate>Expand the major epochs of Korean history, art evolution, and cultural breakthroughs.</Translate></p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
          {/* Dynasty selector list */}
          <div className="space-y-2.5 lg:col-span-1">
            {translatedTimeline.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTimeline(item.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between group cursor-pointer ${
                  activeTimeline === item.id
                    ? "bg-white text-stone-950 border-white"
                    : "bg-stone-900/60 text-stone-300 border-stone-800 hover:bg-stone-900"
                }`}
              >
                <div>
                  <span className={`text-[9px] font-mono ${activeTimeline === item.id ? "text-amber-700" : "text-stone-500"}`}>
                    {item.period}
                  </span>
                  <h4 className="font-display font-bold text-xs md:text-sm mt-0.5">{item.title}</h4>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${activeTimeline === item.id ? "translate-x-1 text-stone-950" : "text-stone-600"}`} />
              </button>
            ))}
          </div>

          {/* Selected Dynasty details panel */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {translatedTimeline.map((item) => {
                if (item.id !== activeTimeline) return null;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.25 }}
                    className="bg-stone-900/55 rounded-2xl border border-stone-800/80 overflow-hidden flex flex-col md:flex-row h-full min-h-[280px]"
                  >
                    <div className="md:w-2/5 h-44 md:h-auto relative">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />
                      <span className="absolute bottom-3 left-3 text-[9px] font-mono bg-amber-500 text-stone-950 font-bold px-2.5 py-0.5 rounded-full">
                        {item.period}
                      </span>
                    </div>

                    <div className="p-6 md:w-3/5 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <span className="text-[10px] text-amber-400 font-mono tracking-wider"><Translate>Dynasty Profile</Translate></span>
                        <h3 className="font-display font-bold text-lg md:text-xl text-white">{item.title}</h3>
                        <p className="text-xs text-amber-200/90 font-medium font-sans leading-relaxed">
                          "{item.summary}"
                        </p>
                        <p className="text-xs text-stone-300 font-sans leading-relaxed mt-2">
                          {item.details}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-[10px] font-mono text-stone-400">
                        <span><Translate>Aesthetics</Translate></span>
                        <span className="text-white"><Translate>Celadon, Porcelain, Royal Art</Translate></span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Palace Details Drawer (Modal popup) */}
      <AnimatePresence>
        {selectedPalace && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPalaceId(null)}
              className="absolute inset-0 bg-stone-950/70 backdrop-blur-xs"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-stone-200/60 max-w-lg w-full relative z-10 flex flex-col"
            >
              <button
                onClick={() => setSelectedPalaceId(null)}
                className="absolute top-4 right-4 bg-black/40 backdrop-blur-md p-1.5 rounded-full text-white hover:bg-black/60 transition-colors z-20 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative h-48 overflow-hidden">
                <img
                  src={selectedPalace.image}
                  alt={selectedPalace.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/10 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <span className="text-[10px] font-mono bg-amber-500 text-stone-950 px-2.5 py-0.5 rounded-sm font-bold uppercase tracking-wider">
                    <Translate>Grand Palace</Translate>
                  </span>
                  <h3 className="text-xl font-display font-bold mt-1.5 flex items-baseline gap-2">
                    {selectedPalace.name}
                    <span className="text-xs font-sans text-stone-300 font-normal">({selectedPalace.koreanName})</span>
                  </h3>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 border-b border-stone-100 pb-4 text-xs font-sans">
                  <div>
                    <span className="text-[10px] text-stone-400 font-mono uppercase tracking-wider block"><Translate>Founded Year</Translate></span>
                    <span className="font-semibold text-stone-900 mt-1 block flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-stone-500" />
                      {selectedPalace.founded} AD
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 font-mono uppercase tracking-wider block"><Translate>Location Address</Translate></span>
                    <span className="font-semibold text-stone-900 mt-1 block flex items-center gap-1 truncate" title={selectedPalace.location}>
                      <MapPin className="w-3.5 h-3.5 text-stone-500" />
                      {selectedPalace.location}
                    </span>
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <span className="text-[10px] text-stone-400 font-mono uppercase tracking-wider block"><Translate>Description</Translate></span>
                  <p className="text-stone-600 leading-relaxed font-sans">{selectedPalace.description}</p>
                </div>

                <div className="space-y-1 text-xs">
                  <span className="text-[10px] text-stone-400 font-mono uppercase tracking-wider block"><Translate>Key Highlights</Translate></span>
                  <p className="text-stone-800 font-medium font-sans bg-amber-50/50 border border-amber-100 p-2.5 rounded-lg flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    {selectedPalace.keyHighlight}
                  </p>
                </div>

                <div className="space-y-1 text-xs bg-stone-50 border border-stone-200/50 p-3 rounded-lg">
                  <span className="text-[10px] text-stone-500 font-mono uppercase tracking-wider block flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5 text-stone-400" />
                    <Translate>Culture & Travel Tip</Translate>
                  </span>
                  <p className="text-stone-600 font-sans leading-relaxed mt-0.5">{selectedPalace.detailedTips}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
