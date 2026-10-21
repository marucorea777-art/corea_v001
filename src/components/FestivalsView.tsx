import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CalendarDays, Search, Heart, MapPin, AlertCircle, Trash2, Calendar, Plus, X } from "lucide-react";
import { FESTIVALS } from "../data";
import { Festival } from "../types";
import seoulLanternImg from "../assets/images/seoul_lantern_festival_1784195734574.jpg";
import { useTranslatedData, useTranslation, Translate } from "../context/LanguageContext";

export default function FestivalsView() {
  const { language, t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeason, setSelectedSeason] = useState<"All" | "Spring" | "Summer" | "Autumn" | "Winter">("All");
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [customFestivals, setCustomFestivals] = useState<Festival[]>([]);

  // Form states for creating custom festivals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formKoreanName, setFormKoreanName] = useState("");
  const [formSeason, setFormSeason] = useState<"Spring" | "Summer" | "Autumn" | "Winter">("Spring");
  const [formLocation, setFormLocation] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formDesc, setFormDesc] = useState("");

  // Translate standard festivals on the fly
  const { translatedData: translatedFESTIVALS, loading: loadingFestivals } = useTranslatedData(FESTIVALS, [
    "name",
    "location",
    "dateRange",
    "description",
    "highlight",
    "features"
  ]);

  // Load wishlist & custom festivals from localStorage
  useEffect(() => {
    const savedWishlist = localStorage.getItem("corea_labs_wishlist");
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
    const savedCustom = localStorage.getItem("corea_labs_custom_festivals");
    if (savedCustom) {
      setCustomFestivals(JSON.parse(savedCustom));
    }
  }, []);

  // Sync Wishlist to localStorage
  const handleToggleWishlist = (id: string) => {
    let updated: string[];
    if (wishlist.includes(id)) {
      updated = wishlist.filter(x => x !== id);
    } else {
      updated = [...wishlist, id];
    }
    setWishlist(updated);
    localStorage.setItem("corea_labs_wishlist", JSON.stringify(updated));
  };

  // Combine standard (translated) and custom festivals
  const allFestivals = [...translatedFESTIVALS, ...customFestivals];

  // Filtering Logic
  const filteredFestivals = allFestivals.filter((fest) => {
    const matchesSearch =
      fest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fest.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fest.koreanName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSeason = selectedSeason === "All" || fest.season === selectedSeason;
    const matchesRegion = selectedRegion === "All" || fest.region === selectedRegion;
    const matchesCategory = selectedCategory === "All" || fest.category === selectedCategory;

    return matchesSearch && matchesSeason && matchesRegion && matchesCategory;
  });

  const handleCreateFestival = (e: FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formLocation.trim() || !formDate.trim() || !formDesc.trim()) {
      alert("Please fill in all required fields!");
      return;
    }

    const newFestival: Festival = {
      id: `custom-${Date.now()}`,
      name: formName,
      koreanName: formKoreanName || "신규 축제",
      season: formSeason,
      location: formLocation,
      dateRange: formDate,
      description: formDesc,
      image: seoulLanternImg, // Default winter/night aesthetic
      highlight: "Custom-curated local celebration",
      features: ["Local food craft", "Art exhibitions", "Performances"],
      month: formSeason === "Spring" ? 4 : formSeason === "Summer" ? 7 : formSeason === "Autumn" ? 10 : 12
    };

    const updatedFestivals = [...customFestivals, newFestival];
    setCustomFestivals(updatedFestivals);
    localStorage.setItem("corea_labs_custom_festivals", JSON.stringify(updatedFestivals));

    // Clear form
    setFormName("");
    setFormKoreanName("");
    setFormLocation("");
    setFormDate("");
    setFormDesc("");
    setIsFormOpen(false);
  };

  const handleDeleteCustomFestival = (id: string) => {
    const updated = customFestivals.filter(x => x.id !== id);
    setCustomFestivals(updated);
    localStorage.setItem("corea_labs_custom_festivals", JSON.stringify(updated));

    // Also remove from wishlist if added
    if (wishlist.includes(id)) {
      const updatedWish = wishlist.filter(x => x !== id);
      setWishlist(updatedWish);
      localStorage.setItem("corea_labs_wishlist", JSON.stringify(updatedWish));
    }
  };

  const wishlistFestivals = allFestivals.filter(f => wishlist.includes(f.id));

  return (
    <div className="space-y-12 pb-16">
      {/* Page Header */}
      <section className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-950 border border-amber-200/50 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider">
          <CalendarDays className="w-3.5 h-3.5 text-amber-700" />
          <Translate>A Celebration of Seasons</Translate>
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-stone-900">
          <Translate>Vibrant Festivals of Korea</Translate>
        </h1>
        <p className="text-xs md:text-sm text-stone-500 font-sans leading-relaxed">
          <Translate>From the spectacular cherry blossoms of Jinhae to mud wrestling on the coast, discover Korea's high-energy traditional events.</Translate>
        </p>
      </section>

      {/* Search & Filter Toolbar */}
      <section className="bg-white rounded-3xl p-5 border border-stone-200/60 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("Search festivals by name, location, or keyword...")}
              className="w-full bg-stone-50 border border-stone-200/80 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-stone-500 focus:bg-white transition-all"
            />
          </div>

          {/* Add custom festival button */}
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-stone-950 text-white rounded-2xl px-4 py-2.5 text-xs font-semibold hover:bg-stone-850 flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <Translate>Submit Event</Translate>
          </button>
        </div>

        {/* Region Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider shrink-0 font-bold">
            <Translate>REGION</Translate>:
          </span>
          <div className="flex gap-1.5 flex-nowrap">
            {[
              { id: "All", labelKo: "전국 전체", labelEn: "All Regions" },
              { id: "Seoul/Capital", labelKo: "서울/수도권", labelEn: "Seoul/Capital" },
              { id: "Gangwon", labelKo: "강원", labelEn: "Gangwon" },
              { id: "Chungcheong", labelKo: "충청", labelEn: "Chungcheong" },
              { id: "Jeolla", labelKo: "전라", labelEn: "Jeolla" },
              { id: "Gyeongsang", labelKo: "경상", labelEn: "Gyeongsang" },
              { id: "Jeju", labelKo: "제주", labelEn: "Jeju" }
            ].map((reg) => (
              <button
                key={reg.id}
                onClick={() => setSelectedRegion(reg.id)}
                className={`px-3 py-1 rounded-xl text-[10px] font-mono uppercase tracking-wider font-medium transition-all cursor-pointer whitespace-nowrap ${
                  selectedRegion === reg.id
                    ? "bg-amber-900 text-white shadow-2xs font-bold"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {language === "ko" ? reg.labelKo : reg.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Category & Season Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-stone-100">
          {/* Season Filter Selector */}
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider shrink-0 font-bold">
              <Translate>SEASON</Translate>:
            </span>
            <div className="flex bg-stone-100 p-0.5 rounded-xl">
              {(["All", "Spring", "Summer", "Autumn", "Winter"] as const).map((season) => (
                <button
                  key={season}
                  onClick={() => setSelectedSeason(season)}
                  className={`px-3 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    selectedSeason === season
                      ? "bg-stone-900 text-white shadow-2xs font-bold"
                      : "text-stone-500 hover:text-stone-900"
                  }`}
                >
                  {season === "All" ? <Translate>All Seasons</Translate> : <Translate>{season}</Translate>}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter Selector */}
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider shrink-0 font-bold">
              <Translate>THEME</Translate>:
            </span>
            <div className="flex gap-1 overflow-x-auto">
              {[
                { id: "All", labelKo: "전체", labelEn: "All Themes" },
                { id: "Flower & Nature", labelKo: "꽃/자연", labelEn: "Flower & Nature" },
                { id: "Traditional & Culture", labelKo: "전통/문화", labelEn: "Traditional & Culture" },
                { id: "Food & Gourmet", labelKo: "먹거리", labelEn: "Food & Gourmet" },
                { id: "Night & Lights", labelKo: "야경/빛", labelEn: "Night & Lights" },
                { id: "Music & Arts", labelKo: "공연/예술", labelEn: "Music & Arts" },
                { id: "Winter & Ice", labelKo: "겨울/얼음", labelEn: "Winter & Ice" }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                    selectedCategory === cat.id
                      ? "bg-stone-800 text-amber-300 font-bold"
                      : "text-stone-500 hover:text-stone-900 hover:bg-stone-100"
                  }`}
                >
                  {language === "ko" ? cat.labelKo : cat.labelEn}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid: Festivals list */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {loadingFestivals ? (
            <div className="col-span-full py-20 text-center flex flex-col items-center justify-center space-y-3 font-sans">
              <div className="w-8 h-8 rounded-full border-2 border-stone-300 border-t-stone-900 animate-spin" />
              <p className="text-xs text-stone-400 font-mono"><Translate>Loading translations...</Translate></p>
            </div>
          ) : filteredFestivals.length === 0 ? (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full bg-white rounded-3xl p-12 text-center space-y-3 border border-stone-200/60 font-sans"
            >
              <AlertCircle className="w-8 h-8 text-stone-300 mx-auto" />
              <h4 className="font-display font-semibold text-stone-700 text-sm">
                <Translate>No Festivals Found</Translate>
              </h4>
              <p className="text-xs text-stone-400 max-w-xs mx-auto">
                <Translate>No events match your current search queries or season filters. Try adjusting your parameters.</Translate>
              </p>
            </motion.div>
          ) : (
            filteredFestivals.map((fest) => {
              const inWishlist = wishlist.includes(fest.id);
              const isCustom = fest.id.startsWith("custom-");

              return (
                <motion.div
                  layout
                  key={fest.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-3xl border border-stone-200/60 overflow-hidden shadow-2xs flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-48 md:h-56 overflow-hidden">
                      <img
                        src={fest.image}
                        alt={fest.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = seoulLanternImg;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />
                      
                      {/* Top labels */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center max-w-[80%]">
                        <span className={`text-[9px] font-mono uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full ${
                          fest.season === "Spring" ? "bg-rose-500 text-white" :
                          fest.season === "Summer" ? "bg-blue-500 text-white" :
                          fest.season === "Autumn" ? "bg-amber-600 text-white" :
                          "bg-slate-700 text-white"
                        }`}>
                          <Translate>{fest.season}</Translate>
                        </span>
                        {fest.region && (
                          <span className="text-[9px] font-mono uppercase tracking-wider font-bold bg-amber-900/90 backdrop-blur-md text-amber-200 px-2 py-0.5 rounded-full border border-amber-500/30">
                            {fest.region}
                          </span>
                        )}
                        {fest.category && (
                          <span className="text-[9px] font-mono uppercase tracking-wider font-bold bg-stone-900/80 backdrop-blur-md text-stone-200 px-2 py-0.5 rounded-full border border-stone-700/50">
                            {fest.category}
                          </span>
                        )}
                        {isCustom && (
                          <span className="text-[9px] font-mono uppercase tracking-wider font-bold bg-purple-500 text-white px-2 py-0.5 rounded-full">
                            <Translate>Custom Event</Translate>
                          </span>
                        )}
                      </div>

                      {/* Favorite trigger button */}
                      <button
                        onClick={() => handleToggleWishlist(fest.id)}
                        className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                          inWishlist 
                            ? "bg-rose-500 text-white hover:bg-rose-600" 
                            : "bg-black/30 text-white hover:bg-black/55 hover:scale-105"
                        }`}
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </button>

                      {/* Bottom display banner */}
                      <div className="absolute bottom-3 left-4 right-4 text-white">
                        <span className="text-[9px] font-mono tracking-widest text-amber-300 uppercase block">
                          {fest.dateRange}
                        </span>
                        <h3 className="font-display font-bold text-base md:text-lg leading-tight mt-0.5 flex items-baseline gap-2">
                          {fest.name}
                          <span className="text-xs font-sans text-stone-300 font-normal">({fest.koreanName})</span>
                        </h3>
                      </div>
                    </div>

                    <div className="p-5 space-y-4">
                      <p className="text-xs text-stone-600 leading-relaxed font-sans">
                        {fest.description}
                      </p>

                      <div className="text-[11px] font-sans bg-amber-50/55 border border-amber-100 p-2.5 rounded-xl flex gap-2">
                        <span className="font-semibold text-amber-800 uppercase shrink-0 font-mono">
                          <Translate>HIGHLIGHT</Translate>:
                        </span>
                        <p className="text-stone-700">{fest.highlight}</p>
                      </div>

                      {/* Bullets */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {fest.features.map((feature, idx) => (
                          <span key={idx} className="text-[9px] font-mono bg-stone-50 text-stone-600 px-2.5 py-1 rounded-md border border-stone-100">
                            ✓ {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    <span className="text-stone-500 flex items-center gap-1 font-sans">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      {fest.location}
                    </span>

                    {isCustom && (
                      <button
                        onClick={() => handleDeleteCustomFestival(fest.id)}
                        className="text-stone-400 hover:text-red-500 p-1.5 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete custom event"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </section>

      {/* Saved Cultural Festivals section */}
      <AnimatePresence>
        {wishlistFestivals.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-stone-900 text-white rounded-3xl p-6 border border-stone-800 shadow-xl space-y-6"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase">
                  <Translate>My Planner</Translate>
                </span>
                <h3 className="font-display font-bold text-base flex items-center gap-2">
                  <Heart className="w-4.5 h-4.5 text-rose-500 fill-rose-500" />
                  <Translate>My Saved Cultural Festivals</Translate> ({wishlistFestivals.length})
                </h3>
              </div>
              <span className="text-[10px] text-stone-400 font-mono hidden md:inline">
                <Translate>Persisted in Local Storage</Translate>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {wishlistFestivals.map((fest) => (
                <div key={fest.id} className="bg-stone-850 border border-stone-800 p-4 rounded-2xl flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono bg-stone-800 text-stone-300 px-2 py-0.5 rounded-sm">
                        <Translate>{fest.season}</Translate>
                      </span>
                      <button
                        onClick={() => handleToggleWishlist(fest.id)}
                        className="text-stone-500 hover:text-red-400 transition-colors cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <h4 className="font-display font-bold text-xs text-white">{fest.name}</h4>
                    <p className="text-[10px] text-stone-400 font-sans leading-relaxed line-clamp-2">
                      {fest.description}
                    </p>
                  </div>

                  <div className="border-t border-stone-800 pt-3 flex items-center justify-between text-[9px] font-mono text-stone-500">
                    <span>{fest.dateRange}</span>
                    <span className="text-amber-400"><Translate>Add to calendar</Translate></span>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Form Dialog Backdrop (Modal) */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="absolute inset-0 bg-stone-950/70 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-stone-200/60 max-w-md w-full relative z-10 flex flex-col p-6 space-y-4 text-stone-950"
            >
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4.5 h-4.5 text-stone-800" />
                  <h3 className="font-display font-bold text-base text-stone-900">
                    <Translate>Submit a Cultural Event</Translate>
                  </h3>
                </div>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-1 rounded-full text-stone-400 hover:bg-stone-50 hover:text-stone-600 transition-all cursor-pointer"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              <form onSubmit={handleCreateFestival} className="space-y-3 text-xs">
                {/* Event Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-wider text-stone-500 uppercase block font-semibold">
                    <Translate>Festival Name</Translate> *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g., Yeongdo Hydrangea Festival"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:border-stone-500"
                  />
                </div>

                {/* Korean name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-wider text-stone-500 uppercase block font-semibold">
                    <Translate>Korean Name (Optional)</Translate>
                  </label>
                  <input
                    type="text"
                    value={formKoreanName}
                    onChange={(e) => setFormKoreanName(e.target.value)}
                    placeholder="e.g., 영도 수국 축제"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:border-stone-500"
                  />
                </div>

                {/* Grid layout for Season & Dates */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono tracking-wider text-stone-500 uppercase block font-semibold">
                      <Translate>Season</Translate> *
                    </label>
                    <select
                      value={formSeason}
                      onChange={(e) => setFormSeason(e.target.value as any)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:border-stone-500 cursor-pointer"
                    >
                      <option value="Spring">{t("Spring")}</option>
                      <option value="Summer">{t("Summer")}</option>
                      <option value="Autumn">{t("Autumn")}</option>
                      <option value="Winter">{t("Winter")}</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono tracking-wider text-stone-500 uppercase block font-semibold">
                      <Translate>Date Range</Translate> *
                    </label>
                    <input
                      type="text"
                      required
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      placeholder="e.g., Early June"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:border-stone-500"
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-wider text-stone-500 uppercase block font-semibold">
                    <Translate>Location City/Area</Translate> *
                  </label>
                  <input
                    type="text"
                    required
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="e.g., Taejongdae, Busan"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:border-stone-500"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-wider text-stone-500 uppercase block font-semibold">
                    <Translate>Description</Translate> *
                  </label>
                  <textarea
                    required
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    placeholder={t("Describe the activities, highlights, and history of the celebration...")}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:border-stone-500 h-18 resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    <Translate>Cancel</Translate>
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-stone-950 hover:bg-stone-850 text-white font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <Translate>Submit Event</Translate>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
