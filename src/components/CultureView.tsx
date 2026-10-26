import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Utensils, Sparkles, Wand2, RefreshCw, Landmark, Share2, Trash2, Eye, Download, Check, ShieldCheck, Heart, Archive } from "lucide-react";
import { CULTURE_CATEGORIES, CULTURE_ITEMS, HANGUL_CONCEPTS, CARD_STYLES } from "../data";
import { useTranslatedData, useTranslation, Translate } from "../context/LanguageContext";
import { useAdmin } from "../context/AdminContext";
import { getPostcards, addPostcard, deletePostcard } from "../services/dataStorage";
import { PostcardLog } from "../types";

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
  const { translatedData: translatedCategories } = useTranslatedData(CULTURE_CATEGORIES, ["title", "subtitle", "intro"]);
  const { translatedData: translatedItems } = useTranslatedData(CULTURE_ITEMS, ["title", "summary", "details", "highlights", "tips"]);
  const { translatedData: translatedConcepts } = useTranslatedData(HANGUL_CONCEPTS, ["meaning", "poeticDescription"]);
  const { translatedData: translatedStyles } = useTranslatedData(CARD_STYLES, ["name"]);

  const activeCategoryData = translatedCategories.find(c => c.id === activeCategory);
  const filteredItems = translatedItems.filter(item => item.categoryId === activeCategory);

  const selectedConcept = translatedConcepts[selectedConceptIndex] || HANGUL_CONCEPTS[0];
  const selectedStyle = translatedStyles[selectedStyleIndex] || CARD_STYLES[0];

  const { isAdmin, adminToken, setShowLoginModal } = useAdmin();
  const [postcards, setPostcards] = useState<PostcardLog[]>([]);
  const [currentCardNumber, setCurrentCardNumber] = useState<number>(() => Math.floor(Math.random() * 90000) + 10000);
  const [selectedModalCard, setSelectedModalCard] = useState<PostcardLog | null>(null);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Load saved postcards
  useEffect(() => {
    getPostcards().then((data) => {
      if (Array.isArray(data)) {
        setPostcards(data);
      }
    });
  }, []);

  const handleGenerateCard = () => {
    setIsGenerating(true);
    const newNum = Math.floor(Math.random() * 90000) + 10000;
    setCurrentCardNumber(newNum);

    setTimeout(async () => {
      setIsGenerating(false);
      setCardGenerated(true);

      const targetRecipient = recipientName.trim() || t("To You") || "Dear Friend";
      const targetMessage = customMessage.trim() || `Wishing you a life filled with '${selectedConcept.romanization}'—the deep connections that make our shared human experience beautiful.`;

      // Automatically log the postcard
      const saved = await addPostcard({
        cardNumber: newNum,
        recipientName: targetRecipient,
        customMessage: targetMessage,
        conceptHangul: selectedConcept.hangul,
        conceptRomanization: selectedConcept.romanization,
        conceptMeaning: selectedConcept.meaning,
        styleId: selectedStyle.id,
        styleName: selectedStyle.name,
        bgGradient: selectedStyle.bgGradient,
        textColor: selectedStyle.textColor,
        fontStyle: selectedStyle.fontStyle,
      });

      setPostcards((prev) => [saved, ...prev.filter((c) => c.id !== saved.id)]);
      setSaveToast(t("Postcard successfully archived in the log gallery!") || "새 엽서가 제작되어 기록소에 보관되었습니다!");
      setTimeout(() => setSaveToast(null), 4000);
    }, 1200);
  };

  const handleManualSave = async () => {
    const targetRecipient = recipientName.trim() || t("To You") || "Dear Friend";
    const targetMessage = customMessage.trim() || `Wishing you a life filled with '${selectedConcept.romanization}'—the deep connections that make our shared human experience beautiful.`;

    const saved = await addPostcard({
      cardNumber: currentCardNumber,
      recipientName: targetRecipient,
      customMessage: targetMessage,
      conceptHangul: selectedConcept.hangul,
      conceptRomanization: selectedConcept.romanization,
      conceptMeaning: selectedConcept.meaning,
      styleId: selectedStyle.id,
      styleName: selectedStyle.name,
      bgGradient: selectedStyle.bgGradient,
      textColor: selectedStyle.textColor,
      fontStyle: selectedStyle.fontStyle,
    });

    setPostcards((prev) => [saved, ...prev.filter((c) => c.id !== saved.id)]);
    setSaveToast(t("Saved to Postcard Archive!") || "엽서가 보관소에 안전하게 저장되었습니다!");
    setTimeout(() => setSaveToast(null), 3000);
  };

  const handleDeletePostcard = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!window.confirm("이 엽서 기록을 삭제하시겠습니까?")) return;
    await deletePostcard(id, adminToken);
    setPostcards((prev) => prev.filter((c) => c.id !== id));
    if (selectedModalCard?.id === id) {
      setSelectedModalCard(null);
    }
  };

  const handleResetCard = () => {
    setCardGenerated(false);
    setRecipientName("");
    setCustomMessage("");
    setCurrentCardNumber(Math.floor(Math.random() * 90000) + 10000);
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
              <h2 className="text-xl md:text-2xl font-display font-bold leading-tight">{t(activeCategoryData.title)}</h2>
              <p className="text-xs font-sans text-stone-300 leading-relaxed">
                {t(activeCategoryData.intro)}
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
                    {t(item.title)}
                    <span className="text-xs font-sans text-stone-300 font-normal">({item.koreanName})</span>
                  </h3>
                </div>
              </div>
              
              <div className="p-5 space-y-4">
                <p className="text-xs text-stone-600 leading-relaxed font-sans">
                  {t(item.details)}
                </p>

                {/* Bullets */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.highlights.map((bullet, idx) => (
                    <span key={idx} className="text-[10px] font-mono bg-stone-50 text-stone-700 px-2.5 py-1 rounded-md border border-stone-100">
                      • {t(bullet)}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {item.tips && (
              <div className="mx-5 mb-5 p-3 rounded-xl bg-amber-50/50 border border-amber-100 text-[11px] text-stone-600 font-sans flex gap-2">
                <span className="font-semibold text-amber-800 uppercase shrink-0 font-mono"><Translate>INSIDER TIP</Translate>:</span>
                <p>{t(item.tips)}</p>
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
                "{t(selectedConcept.meaning)}": {t(selectedConcept.poeticDescription)}
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
                    <span>{t(style.name)}</span>
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
                        <div className="text-[8px] font-mono opacity-60">No. {currentCardNumber}</div>
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
                          {t(selectedConcept.meaning)}
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
                      onClick={handleManualSave}
                      className="px-4 py-2 bg-stone-900 border border-stone-800 text-stone-200 text-xs font-medium rounded-lg hover:bg-stone-850 flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5 text-amber-400" />
                      <Translate>보관소에 재저장</Translate>
                    </button>
                    <button
                      onClick={handleResetCard}
                      className="px-4 py-2 bg-stone-800 text-stone-300 text-xs font-medium rounded-lg hover:bg-stone-700 transition-colors cursor-pointer"
                    >
                      <Translate>새로 만들기</Translate>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Save feedback toast */}
        {saveToast && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-3.5 bg-stone-900 text-amber-400 border border-amber-400/30 rounded-2xl text-xs font-medium flex items-center justify-between shadow-xl max-w-md mx-auto"
          >
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{saveToast}</span>
            </div>
            <button
              onClick={() => setSaveToast(null)}
              className="text-stone-400 hover:text-white text-xs px-2 cursor-pointer"
            >
              ✕
            </button>
          </motion.div>
        )}
      </section>

      {/* Postcard Archive & Log Gallery */}
      <section className="space-y-6 pt-4 border-t border-stone-200/70">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-full text-[11px] font-mono uppercase tracking-wider">
              <Archive className="w-3 h-3 text-amber-600" />
              <Translate>제작된 한지 엽서 기록소</Translate>
            </div>
            <h3 className="text-xl md:text-2xl font-display font-bold text-stone-900 tracking-tight">
              <Translate>엽서 아카이브 & 제작 로그</Translate>
            </h3>
            <p className="text-xs text-stone-500 font-sans">
              <Translate>이곳 연구실에서 방문객들이 제작한 전통 철학 한지 엽서 기록입니다.</Translate>
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-xs font-mono font-medium bg-stone-100 text-stone-700 border border-stone-200 px-3 py-1.5 rounded-full">
              <Translate>총</Translate> {postcards.length}<Translate>장의 엽서 보관됨</Translate>
            </span>
            {!isAdmin ? (
              <button
                onClick={() => setShowLoginModal(true)}
                className="text-xs font-medium text-stone-500 hover:text-stone-900 flex items-center gap-1 px-3 py-1.5 rounded-full border border-dashed border-stone-300 hover:border-stone-400 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span><Translate>관리자 로그인</Translate></span>
              </button>
            ) : (
              <span className="text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                <span><Translate>관리자 권한: 삭제 가능</Translate></span>
              </span>
            )}
          </div>
        </div>

        {/* Postcards Grid */}
        {postcards.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white border border-stone-200/80 space-y-3">
            <Landmark className="w-10 h-10 text-stone-300 mx-auto" />
            <h4 className="font-display font-semibold text-stone-700 text-sm">
              <Translate>아직 보관된 엽서가 없습니다</Translate>
            </h4>
            <p className="text-xs text-stone-400 max-w-sm mx-auto">
              <Translate>위의 캘리그래피 제작기에서 엽서를 생성하면 이곳 기록소에 자동으로 영구 보관됩니다.</Translate>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {postcards.map((card) => (
              <motion.div
                key={card.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group bg-white rounded-2xl border border-stone-200/80 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                {/* Mini Card Preview Header */}
                <div className={`p-4 bg-gradient-to-b ${card.bgGradient} ${card.textColor} relative aspect-[16/10] flex flex-col justify-between border-b border-stone-100`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] font-mono tracking-wider opacity-75">COREA LABS</span>
                      <div className="text-[8px] font-mono opacity-60">No. {card.cardNumber}</div>
                    </div>
                    {/* Stamp */}
                    <div className="w-5 h-5 bg-red-600 rounded-xs border border-red-700 flex items-center justify-center text-white text-[8px] font-display font-extrabold rotate-[-5deg] shadow-xs">
                      <span>국가</span>
                    </div>
                  </div>

                  {/* Big Hangul Calligraphy */}
                  <div className="text-center my-auto">
                    <span className={`text-4xl md:text-5xl font-bold tracking-normal ${card.fontStyle}`}>
                      {card.conceptHangul}
                    </span>
                    <div className="text-[10px] font-mono uppercase tracking-widest mt-0.5 opacity-90">
                      {card.conceptRomanization}
                    </div>
                  </div>

                  <div className="flex justify-between items-end text-[9px] font-sans opacity-80">
                    <span className="truncate max-w-[140px] font-medium">To: {card.recipientName}</span>
                    <span className="text-[8px] font-mono opacity-60">
                      {new Date(card.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Card Details & Actions */}
                <div className="p-4 space-y-3 flex-grow flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-stone-900">{card.recipientName}</span>
                      <span className="text-[10px] font-mono text-stone-400 bg-stone-100 px-2 py-0.5 rounded-md">
                        {t(card.styleName)}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600 italic line-clamp-2 font-sans">
                      "{card.customMessage}"
                    </p>
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedModalCard(card)}
                      className="flex-1 py-1.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span><Translate>엽서 크게보기</Translate></span>
                    </button>
                    {isAdmin && (
                      <button
                        onClick={(e) => handleDeletePostcard(card.id, e)}
                        title="엽서 삭제 (관리자)"
                        className="p-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Full Postcard Modal */}
      <AnimatePresence>
        {selectedModalCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="bg-white rounded-3xl shadow-2xl border border-stone-200 max-w-sm w-full overflow-hidden p-6 space-y-5"
            >
              {/* Full Card */}
              <div
                className={`rounded-2xl p-6 bg-gradient-to-b ${selectedModalCard.bgGradient} ${selectedModalCard.textColor} shadow-2xl relative aspect-[3/4] flex flex-col justify-between border border-white/10`}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono tracking-widest uppercase opacity-75">Corea Labs</span>
                    <div className="text-[8px] font-mono opacity-60">No. {selectedModalCard.cardNumber}</div>
                  </div>
                  <div className="w-7 h-7 bg-red-600 rounded-sm border border-red-700 flex items-center justify-center text-white text-[10px] font-display font-extrabold tracking-tighter leading-none shadow-xs rotate-[-6deg]">
                    <span className="rotate-[6deg]">한국<br/>국가</span>
                  </div>
                </div>

                <div className="text-center py-4 space-y-2">
                  <h1 className={`text-6xl md:text-7xl font-bold tracking-normal ${selectedModalCard.fontStyle}`}>
                    {selectedModalCard.conceptHangul}
                  </h1>
                  <div className="space-y-1">
                    <div className="text-sm font-mono tracking-widest font-semibold uppercase opacity-90">
                      {selectedModalCard.conceptRomanization}
                    </div>
                    <div className="text-[10px] font-sans opacity-75 max-w-[200px] mx-auto leading-normal">
                      {selectedModalCard.conceptMeaning}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-current/10 font-sans">
                  <div className="text-xs font-semibold tracking-tight">
                    {selectedModalCard.recipientName}
                  </div>
                  <p className="text-[11px] leading-relaxed italic opacity-85 font-light">
                    {selectedModalCard.customMessage}
                  </p>
                  <div className="flex justify-between items-center text-[9px] font-mono opacity-60 pt-1">
                    <span>{new Date(selectedModalCard.createdAt).toLocaleString()}</span>
                    <span>Seoul Sky</span>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `[Corea Labs Postcard #${selectedModalCard.cardNumber}]\nTo: ${selectedModalCard.recipientName}\nConcept: ${selectedModalCard.conceptHangul} (${selectedModalCard.conceptRomanization})\nMessage: ${selectedModalCard.customMessage}`
                    );
                    alert("엽서 내용이 클립보드에 복사되었습니다!");
                  }}
                  className="flex-1 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  <Translate>텍스트 복사</Translate>
                </button>
                {isAdmin && (
                  <button
                    onClick={() => handleDeletePostcard(selectedModalCard.id)}
                    className="py-2.5 px-3 border border-red-200 text-red-600 rounded-xl text-xs font-medium hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setSelectedModalCard(null)}
                  className="py-2.5 px-4 bg-stone-100 text-stone-700 rounded-xl text-xs font-semibold hover:bg-stone-200 transition-colors cursor-pointer"
                >
                  <Translate>닫기</Translate>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
