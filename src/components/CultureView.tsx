import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Utensils, Sparkles, Wand2, RefreshCw, Landmark, Share2 } from "lucide-react";
import { CULTURE_CATEGORIES, CULTURE_ITEMS, HANGUL_CONCEPTS, CARD_STYLES } from "../data";
import { useTranslatedData, useTranslation, Translate } from "../context/LanguageContext";

export default function CultureView() {
  const { language, t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<string>("gastronomy");
  
  // Calligraphy card generator states
  const [selectedConceptIndex, setSelectedConceptIndex] = useState<number>(0);
  const [selectedStyleIndex, setSelectedStyleIndex] = useState<number>(0);
  const [recipientName, setRecipientName] = useState<string>("");
  const [customMessage, setCustomMessage] = useState<string>("");
  const [cardGenerated, setCardGenerated] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Dynamic Translation of static content
  const { translatedData: translatedCategories } = useTranslatedData(CULTURE_CATEGORIES, ["title", "intro"]);
  const { translatedData: translatedItems } = useTranslatedData(CULTURE_ITEMS, ["title", "details", "highlights", "tips"]);
  const { translatedData: translatedConcepts } = useTranslatedData(HANGUL_CONCEPTS, ["meaning", "poeticDescription"]);
  const { translatedData: translatedStyles } = useTranslatedData(CARD_STYLES, ["name"]);

  const activeCategoryData = translatedCategories.find(c => c.id === activeCategory);
  const filteredItems = translatedItems.filter(item => item.categoryId === activeCategory);

  const selectedConcept = translatedConcepts[selectedConceptIndex] || HANGUL_CONCEPTS[0];
  const selectedStyle = translatedStyles[selectedStyleIndex] || CARD_STYLES[0];

  const handleGenerateCard = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setCardGenerated(true);
    }, 1200);
  };

  const handleResetCard = () => {
    setCardGenerated(false);
    setRecipientName("");
    setCustomMessage("");
  };

  return (
    <div className="space-y-12">
      {/* Page Header */}
      <section className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 bg-rose-100 text-rose-950 border border-rose-200/50 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider">
          <Utensils className="w-3 h-3 text-rose-700" />
          <Translate>The Pulse of Korea: Living Culture</Translate>
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-stone-900">
          <Translate>Where Ancient Soul Meets Future Vision</Translate>
        </h1>
        <p className="text-xs md:text-sm text-stone-500 font-sans leading-relaxed">
          <Translate>From the deep wisdom of slow fermented cuisine to hyper-synchronized performances and smart-city robotic futures.</Translate>
        </p>
      </section>

      {/* Culture Category Navigator */}
      <section className="space-y-6">
        <div className="flex flex-wrap gap-2 justify-center">
          {translatedCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-3 rounded-2xl text-xs font-medium transition-all flex items-center gap-2 cursor-pointer border ${
                activeCategory === cat.id
                  ? "bg-stone-900 text-white border-stone-950 shadow-md scale-102"
                  : "bg-white text-stone-600 hover:text-stone-950 border-stone-200/60"
              }`}
            >
              <span>{cat.title}</span>
            </button>
          ))}
        </div>

        {/* Selected Category Intro Banner */}
        {activeCategoryData && (
          <motion.div
            layout
            key={activeCategoryData.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-3xl overflow-hidden bg-stone-950 text-white p-6 md:p-10 flex flex-col justify-end min-h-[220px] md:min-h-[260px] border border-stone-800"
          >
            <div className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity" style={{ backgroundImage: `url(${activeCategoryData.coverImage})` }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            
            <div className="relative z-10 max-w-xl space-y-2">
              <span className="text-[9px] font-mono tracking-widest text-amber-400 uppercase"><Translate>Interactive Capsule</Translate></span>
              <h2 className="text-xl md:text-2xl font-display font-bold leading-tight">{activeCategoryData.title}</h2>
              <p className="text-xs font-sans text-stone-300 leading-relaxed">
                {activeCategoryData.intro}
              </p>
            </div>
          </motion.div>
        )}
      </section>

      {/* Category Sub Items Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredItems.map((item) => (
          <motion.div
            key={item.id}
            className="bg-white rounded-3xl border border-stone-200/60 overflow-hidden shadow-2xs flex flex-col justify-between"
          >
            <div>
              <div className="relative h-44 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-3 left-4 text-white">
                  <h3 className="font-display font-bold text-base flex items-baseline gap-2">
                    {item.title}
                    <span className="text-xs font-sans text-stone-300 font-normal">({item.koreanName})</span>
                  </h3>
                </div>
              </div>
              
              <div className="p-5 space-y-4">
                <p className="text-xs text-stone-600 leading-relaxed font-sans">
                  {item.details}
                </p>

                {/* Bullets */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.highlights.map((bullet, idx) => (
                    <span key={idx} className="text-[10px] font-mono bg-stone-50 text-stone-700 px-2.5 py-1 rounded-md border border-stone-100">
                      • {bullet}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {item.tips && (
              <div className="mx-5 mb-5 p-3 rounded-xl bg-amber-50/50 border border-amber-100 text-[11px] text-stone-600 font-sans flex gap-2">
                <span className="font-semibold text-amber-800 uppercase shrink-0 font-mono"><Translate>INSIDER TIP</Translate>:</span>
                <p>{item.tips}</p>
              </div>
            )}
          </motion.div>
        ))}
      </section>

      {/* Interactive Concept Calligraphy & Card Generator */}
      <section className="bg-stone-900 text-white rounded-3xl p-6 md:p-8 border border-stone-800 shadow-xl space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />

        <div className="space-y-1 relative z-10">
          <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase"><Translate>Living Art Laboratory</Translate></span>
          <h2 className="text-xl md:text-2xl font-display font-bold tracking-tight text-white flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-amber-400" />
            <Translate>Traditional Calligraphy & Card Creator</Translate>
          </h2>
          <p className="text-xs text-stone-400"><Translate>Craft a beautifully styled visual greeting postcard featuring an ancient Korean philosophical concept.</Translate></p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
          {/* Card Configurator Controls */}
          <div className="lg:col-span-5 space-y-5">
            {/* Step 1: Concept Selector */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono tracking-wider text-stone-400 uppercase block"><Translate>1. Select Core Philosophy</Translate></label>
              <div className="grid grid-cols-5 gap-1.5">
                {translatedConcepts.map((concept, index) => (
                  <button
                    key={concept.hangul}
                    onClick={() => {
                      setSelectedConceptIndex(index);
                      setCardGenerated(false);
                    }}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      selectedConcept.hangul === concept.hangul
                        ? "bg-amber-400 text-stone-950 border-amber-400 font-bold"
                        : "bg-stone-800 text-stone-300 border-stone-700/60 hover:bg-stone-700"
                    }`}
                  >
                    <span className="text-lg block font-display">{concept.hangul}</span>
                    <span className="text-[9px] block opacity-80 mt-0.5">{concept.romanization}</span>
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-stone-400 leading-relaxed mt-1 italic">
                "{selectedConcept.meaning}": {selectedConcept.poeticDescription}
              </p>
            </div>

            {/* Step 2: Styling selector */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono tracking-wider text-stone-400 uppercase block"><Translate>2. Select Traditional Palette</Translate></label>
              <div className="grid grid-cols-2 gap-2">
                {translatedStyles.map((style, index) => (
                  <button
                    key={style.id}
                    onClick={() => {
                      setSelectedStyleIndex(index);
                      setCardGenerated(false);
                    }}
                    className={`px-3 py-2 rounded-xl text-left border text-xs transition-all flex items-center justify-between cursor-pointer ${
                      selectedStyle.id === style.id
                        ? "bg-stone-100 text-stone-950 border-stone-100 font-semibold"
                        : "bg-stone-800 text-stone-300 border-stone-700/60 hover:bg-stone-700"
                    }`}
                  >
                    <span>{style.name}</span>
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Personalized Inputs */}
            <div className="space-y-3 pt-1">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono tracking-wider text-stone-400 uppercase block"><Translate>3. Sender / Recipient Name</Translate></label>
                <input
                  type="text"
                  maxLength={20}
                  value={recipientName}
                  onChange={(e) => {
                    setRecipientName(e.target.value);
                    setCardGenerated(false);
                  }}
                  placeholder={t("e.g., Dear Sophie") || "e.g., Dear Sophie"}
                  className="w-full bg-stone-800/80 border border-stone-700 rounded-xl px-4 py-2.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-stone-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono tracking-wider text-stone-400 uppercase block font-sans"><Translate>4. Heartfelt Greeting Note</Translate></label>
                <textarea
                  maxLength={70}
                  value={customMessage}
                  onChange={(e) => {
                    setCustomMessage(e.target.value);
                    setCardGenerated(false);
                  }}
                  placeholder={t("e.g., Wishing you a peaceful season full of warmth.") || "e.g., Wishing you a peaceful season full of warmth."}
                  className="w-full bg-stone-800/80 border border-stone-700 rounded-xl px-4 py-2.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-stone-500 transition-colors h-16 resize-none"
                />
              </div>
            </div>

            <button
              onClick={handleGenerateCard}
              disabled={isGenerating || !recipientName.trim()}
              className={`w-full py-3 rounded-xl font-semibold text-xs tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                !recipientName.trim()
                  ? "bg-stone-800 text-stone-500 border border-stone-700 cursor-not-allowed"
                  : "bg-amber-400 text-stone-950 hover:bg-amber-300"
              }`}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <Translate>Grinding Natural Pigments...</Translate>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <Translate>Generate Postcard Card</Translate>
                </>
              )}
            </button>
          </div>

          {/* Interactive Card Canvas Preview */}
          <div className="lg:col-span-7 flex items-center justify-center bg-stone-950 rounded-2xl p-4 min-h-[300px] border border-stone-800/60 relative">
            <AnimatePresence mode="wait">
              {!cardGenerated && !isGenerating ? (
                <motion.div
                  key="empty-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center p-6 space-y-2 text-stone-400 font-sans"
                >
                  <Landmark className="w-10 h-10 text-stone-700 mx-auto" />
                  <h4 className="font-display font-semibold text-stone-300 text-sm"><Translate>Interactive Art Stage</Translate></h4>
                  <p className="text-xs max-w-xs leading-relaxed mx-auto text-stone-500">
                    <Translate>Input a name in the configurator, then click generate to craft your customized Hanji postcard on screen.</Translate>
                  </p>
                </motion.div>
              ) : isGenerating ? (
                <motion.div
                  key="generating-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center p-6 space-y-4"
                >
                  <div className="w-12 h-12 rounded-full border-2 border-stone-800 border-t-amber-400 animate-spin mx-auto" />
                  <div className="space-y-1">
                    <p className="text-xs font-mono text-stone-400"><Translate>Sumukhwa Ink wash absorption...</Translate></p>
                    <p className="text-[10px] text-stone-600 font-mono"><Translate>Calculating seal placement</Translate></p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="card-preview"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, type: "spring" }}
                  className="w-full max-w-sm"
                >
                  {/* The Postcard Card itself */}
                  <div className={`rounded-2xl p-6 bg-gradient-to-b ${selectedStyle.bgGradient} ${selectedStyle.textColor} shadow-2xl relative aspect-[3/4] flex flex-col justify-between border border-white/10`}>
                    
                    {/* Top Row: Brand & Red Seal */}
                    <div className="flex justify-between items-start">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-mono tracking-widest uppercase opacity-75">Corea Labs</span>
                        <div className="text-[8px] font-mono opacity-60">No. {Math.floor(Math.random() * 90000) + 10000}</div>
                      </div>
                      
                      {/* Traditional Red Stamp (Do-jang) */}
                      <div className="w-7 h-7 bg-red-600 rounded-sm border border-red-700 flex items-center justify-center text-white text-[10px] font-display font-extrabold tracking-tighter leading-none shadow-xs rotate-[-6deg]">
                        <span className="rotate-[6deg]">한국<br/>국가</span>
                      </div>
                    </div>

                    {/* Middle Row: Massive Calligraphy Display */}
                    <div className="text-center py-4 space-y-2">
                      <motion.h1 
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className={`text-6xl md:text-7xl font-bold tracking-normal ${selectedStyle.fontStyle}`}
                      >
                        {selectedConcept.hangul}
                      </motion.h1>
                      <div className="space-y-1">
                        <div className="text-sm font-mono tracking-widest font-semibold uppercase opacity-90">
                          {selectedConcept.romanization}
                        </div>
                        <div className="text-[10px] font-sans opacity-75 max-w-[200px] mx-auto leading-normal">
                          {selectedConcept.meaning}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Row: Personalized Note */}
                    <div className="space-y-3 pt-4 border-t border-current/10 font-sans">
                      <div className="text-xs font-semibold tracking-tight">
                        {recipientName || <Translate>To You</Translate>}
                      </div>
                      
                      <p className="text-[11px] leading-relaxed italic opacity-85 font-light line-clamp-2">
                        {customMessage || (
                          <span>
                            <Translate>Wishing you a life filled with</Translate> '{selectedConcept.romanization}'—<Translate>the deep connections that make our shared human experience beautiful.</Translate>
                          </span>
                        )}
                      </p>

                      <div className="text-[9px] font-mono opacity-60 text-right">
                        <Translate>Crafted under the Seoul Sky</Translate>
                      </div>
                    </div>
                  </div>

                  {/* Actions under card */}
                  <div className="flex gap-2.5 mt-4 justify-center">
                    <button
                      onClick={() => alert("Postcard saved! In a full-production environment, this triggers a PDF/Image render of your customized Hanji postcard.")}
                      className="px-4 py-2 bg-stone-900 border border-stone-800 text-stone-200 text-xs font-medium rounded-lg hover:bg-stone-850 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Translate>Save Card</Translate>
                    </button>
                    <button
                      onClick={handleResetCard}
                      className="px-4 py-2 bg-stone-800 text-stone-300 text-xs font-medium rounded-lg hover:bg-stone-700 transition-colors cursor-pointer"
                    >
                      <Translate>Create Another</Translate>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}
