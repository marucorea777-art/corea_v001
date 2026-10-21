import { useState, useEffect, FormEvent, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  CalendarDays, 
  Search, 
  Heart, 
  MapPin, 
  AlertCircle, 
  Trash2, 
  Calendar, 
  Plus, 
  X, 
  ShieldCheck, 
  Check, 
  Sparkles, 
  Edit3,
  Image as ImageIcon 
} from "lucide-react";
import { FESTIVALS } from "../data";
import { Festival } from "../types";
import seoulLanternImg from "../assets/images/seoul_lantern_festival_1784195734574.jpg";
import { useTranslatedData, useTranslation, Translate } from "../context/LanguageContext";
import { useAdmin } from "../context/AdminContext";
import { 
  getCustomFestivals, 
  getDeletedFestivalIds, 
  addFestival, 
  updateFestival,
  deleteFestival 
} from "../services/dataStorage";
import ImageUploader, { ImagePreset } from "./ImageUploader";

// High-resolution real photorealistic festival presets (adhering strictly to AGENTS.md real photography rule)
const REAL_FESTIVAL_PRESETS: ImagePreset[] = [
  {
    label: "Jinhae Cherry Blossoms",
    koreanLabel: "진해 벚꽃",
    url: "https://images.unsplash.com/photo-1522383225653-ed111181a951?q=80&w=1200&auto=format&fit=crop",
  },
  {
    label: "Boryeong Mud Coast",
    koreanLabel: "보령 머드 해변",
    url: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1200&auto=format&fit=crop",
  },
  {
    label: "Daegu Craft Chimaek",
    koreanLabel: "대구 치맥",
    url: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?q=80&w=1200&auto=format&fit=crop",
  },
  {
    label: "Jinju Floating Lanterns",
    koreanLabel: "진주 남강 유등",
    url: "https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?q=80&w=1200&auto=format&fit=crop",
  },
  {
    label: "Boseong Green Tea",
    koreanLabel: "보성 다향 녹차",
    url: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=1200&auto=format&fit=crop",
  },
  {
    label: "Hwacheon Winter Ice",
    koreanLabel: "화천 산천어 얼음",
    url: "https://images.unsplash.com/photo-1517299321909-be09a53827a2?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function FestivalsView() {
  const { language, t } = useTranslation();
  const { isAdmin, adminToken, setShowLoginModal } = useAdmin();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeason, setSelectedSeason] = useState<"All" | "Spring" | "Summer" | "Autumn" | "Winter">("All");
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [wishlist, setWishlist] = useState<string[]>([]);
  
  // Custom festivals & deleted IDs
  const [customFestivals, setCustomFestivals] = useState<Festival[]>([]);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  // Form states for creating or editing custom festivals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFestivalId, setEditingFestivalId] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [formKoreanName, setFormKoreanName] = useState("");
  const [formSeason, setFormSeason] = useState<"Spring" | "Summer" | "Autumn" | "Winter">("Spring");
  const [formRegion, setFormRegion] = useState<string>("Seoul/Capital");
  const [formCategory, setFormCategory] = useState<string>("Traditional & Culture");
  const [formLocation, setFormLocation] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formMonth, setFormMonth] = useState<number>(4);
  const [formDesc, setFormDesc] = useState("");
  const [formHighlight, setFormHighlight] = useState("");
  const [formFeatures, setFormFeatures] = useState("");
  const [formImage, setFormImage] = useState(REAL_FESTIVAL_PRESETS[0].url);

  // Load wishlist, custom festivals, and deleted IDs from storage
  useEffect(() => {
    const savedWishlist = localStorage.getItem("corea_labs_wishlist");
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
    getCustomFestivals().then(setCustomFestivals);
    setDeletedIds(getDeletedFestivalIds());
  }, []);

  // Sync Wishlist to localStorage
  const handleToggleWishlist = (id: string) => {
    let updated: string[];
    if (wishlist.includes(id)) {
      updated = wishlist.filter((x) => x !== id);
    } else {
      updated = [...wishlist, id];
    }
    setWishlist(updated);
    localStorage.setItem("corea_labs_wishlist", JSON.stringify(updated));
  };

  // Filter default presets by deleted IDs
  const activeDefaultFestivals = useMemo(() => {
    return FESTIVALS.filter((f) => !deletedIds.includes(f.id));
  }, [deletedIds]);

  // Translate standard festivals on the fly
  const { translatedData: translatedFESTIVALS } = useTranslatedData(activeDefaultFestivals, [
    "name",
    "location",
    "dateRange",
    "description",
    "highlight",
    "features",
  ]);

  // Combine standard and custom festivals, letting edited versions in customFestivals override default ones!
  const allFestivals = useMemo(() => {
    const activeCustom = customFestivals.filter((f) => !deletedIds.includes(f.id));
    const customMap = new Map(activeCustom.map((f) => [f.id, f]));

    // If an existing default festival was edited, replace it with the custom edited version
    const resolvedDefaults = translatedFESTIVALS.map((df) => customMap.get(df.id) || df);
    
    // Add custom festivals whose ID is not already among default festivals
    const defaultIds = new Set(translatedFESTIVALS.map((df) => df.id));
    const pureCustom = activeCustom.filter((cf) => !defaultIds.has(cf.id));

    return [...resolvedDefaults, ...pureCustom];
  }, [translatedFESTIVALS, customFestivals, deletedIds]);

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

  // Handler: Open modal for creating a new festival
  const handleOpenCreateModal = () => {
    setEditingFestivalId(null);
    setFormName("");
    setFormKoreanName("");
    setFormSeason("Spring");
    setFormRegion("Seoul/Capital");
    setFormCategory("Traditional & Culture");
    setFormLocation("");
    setFormDate("");
    setFormMonth(4);
    setFormDesc("");
    setFormHighlight("");
    setFormFeatures("");
    setFormImage(REAL_FESTIVAL_PRESETS[0].url);
    setIsFormOpen(true);
  };

  // Handler: Open modal for editing an existing festival
  const handleStartEditFestival = (fest: Festival) => {
    setEditingFestivalId(fest.id);
    setFormName(fest.name || "");
    setFormKoreanName(fest.koreanName || fest.name || "");
    setFormSeason(fest.season || "Spring");
    setFormRegion(fest.region || "Seoul/Capital");
    setFormCategory(fest.category || "Traditional & Culture");
    setFormLocation(fest.location || "");
    setFormDate(fest.dateRange || "");
    setFormMonth(fest.month || (fest.season === "Spring" ? 4 : fest.season === "Summer" ? 7 : fest.season === "Autumn" ? 10 : 1));
    setFormDesc(fest.description || "");
    setFormHighlight(fest.highlight || "");
    setFormFeatures((fest.features || []).join(", "));
    setFormImage(fest.image || REAL_FESTIVAL_PRESETS[0].url);
    setIsFormOpen(true);
  };

  // Handler: Add or Edit festival (Admin only)
  const handleSaveFestival = async (e: FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formLocation.trim() || !formDate.trim() || !formDesc.trim()) {
      alert("축제 이름, 개최 장소, 개최 기간, 축제 설명을 모두 입력해 주세요.");
      return;
    }

    const featuresArray = formFeatures
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);

    if (editingFestivalId) {
      // Editing existing festival (works for both presets and custom ones!)
      const updatedFestival: Festival = {
        id: editingFestivalId,
        name: formName.trim(),
        koreanName: formKoreanName.trim() || formName.trim(),
        season: formSeason,
        region: formRegion as any,
        category: formCategory as any,
        location: formLocation.trim(),
        dateRange: formDate.trim(),
        description: formDesc.trim(),
        image: formImage.trim() || seoulLanternImg,
        highlight: formHighlight.trim() || "Authentic cultural festival experience",
        features: featuresArray.length > 0 ? featuresArray : ["Traditional performances", "Local cuisine", "Interactive crafts"],
        month: formMonth || 4,
        isCustom: true,
      };

      const saved = await updateFestival(updatedFestival, adminToken);
      setCustomFestivals((prev) => [...prev.filter((f) => f.id !== saved.id), saved]);

      setIsFormOpen(false);
      setEditingFestivalId(null);
      setToastNotice(`'${saved.name} (${saved.koreanName})' 축제 정보가 수정되었습니다!`);
      setTimeout(() => setToastNotice(null), 3500);
    } else {
      // Creating new custom festival
      const newFestival: Festival = {
        id: `custom_fest_${Date.now()}`,
        name: formName.trim(),
        koreanName: formKoreanName.trim() || formName.trim(),
        season: formSeason,
        region: formRegion as any,
        category: formCategory as any,
        location: formLocation.trim(),
        dateRange: formDate.trim(),
        description: formDesc.trim(),
        image: formImage.trim() || seoulLanternImg,
        highlight: formHighlight.trim() || "Authentic cultural festival experience",
        features: featuresArray.length > 0 ? featuresArray : ["Traditional performances", "Local cuisine", "Interactive crafts"],
        month: formMonth || 4,
        isCustom: true,
      };

      const saved = await addFestival(newFestival, adminToken);
      setCustomFestivals((prev) => [...prev.filter((f) => f.id !== saved.id), saved]);

      setIsFormOpen(false);
      setEditingFestivalId(null);
      setToastNotice(`'${saved.name} (${saved.koreanName})' 축제가 등록되었습니다!`);
      setTimeout(() => setToastNotice(null), 3500);
    }
  };

  // Handler: Delete festival (Admin only, can delete any festival)
  const handleDeleteFestival = async (id: string, name: string) => {
    if (!window.confirm(`'${name}' 축제를 삭제하시겠습니까?`)) {
      return;
    }

    await deleteFestival(id, adminToken);
    setDeletedIds((prev) => [...prev, id]);
    setCustomFestivals((prev) => prev.filter((x) => x.id !== id));

    if (wishlist.includes(id)) {
      const updatedWish = wishlist.filter((x) => x !== id);
      setWishlist(updatedWish);
      localStorage.setItem("corea_labs_wishlist", JSON.stringify(updatedWish));
    }

    setToastNotice(`'${name}' 축제가 삭제되었습니다.`);
    setTimeout(() => setToastNotice(null), 3500);
  };

  const wishlistFestivals = allFestivals.filter((f) => wishlist.includes(f.id));

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
          <Translate>From spectacular cherry blossoms of Jinhae to mud wrestling on the coast, discover Korea's high-energy traditional events.</Translate>
        </p>

        {/* Admin status pill */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
          {isAdmin ? (
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-300 px-3 py-1.5 rounded-full text-xs text-amber-900">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span className="font-semibold"><Translate>관리자 모드 활성화</Translate></span>
              <button
                onClick={handleOpenCreateModal}
                className="ml-1 bg-stone-900 hover:bg-stone-850 text-white px-3 py-1 rounded-full text-[11px] font-medium flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
              >
                <Plus className="w-3 h-3 text-amber-400" />
                <span><Translate>축제 추가하기</Translate></span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1.5 bg-white border border-stone-200/80 hover:border-stone-400 px-3 py-1.5 rounded-full transition-all cursor-pointer shadow-2xs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
              <span><Translate>관리자로 로그인하여 축제 추가/수정/삭제</Translate></span>
            </button>
          )}
        </div>

        {/* Action Notice Toast */}
        {toastNotice && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-2.5 bg-stone-900 text-amber-400 border border-amber-400/30 rounded-xl text-xs font-medium inline-flex items-center gap-2 shadow-lg"
          >
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{toastNotice}</span>
          </motion.div>
        )}
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
              placeholder={t("Search festivals by name, location, or keyword...") || "축제 이름, 장소, 키워드로 검색..."}
              className="w-full bg-stone-50 border border-stone-200/80 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-stone-500 focus:bg-white transition-all"
            />
          </div>

          {/* Add festival button */}
          <button
            onClick={() => {
              if (isAdmin) {
                setIsFormOpen(true);
              } else {
                setShowLoginModal(true);
              }
            }}
            className="bg-stone-950 text-white rounded-2xl px-4 py-2.5 text-xs font-semibold hover:bg-stone-850 flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-colors shrink-0"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>{isAdmin ? <Translate>+ 축제 수동 등록</Translate> : <Translate>축제 등록 (관리자)</Translate>}</span>
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
              { id: "Jeju", labelKo: "제주", labelEn: "Jeju" },
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
                <Translate>{reg.labelEn}</Translate>
              </button>
            ))}
          </div>
        </div>

        {/* Category & Season Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-stone-100">
          {/* Season Filter Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider shrink-0 font-bold">
              <Translate>SEASON</Translate>:
            </span>
            {(["All", "Spring", "Summer", "Autumn", "Winter"] as const).map((season) => (
              <button
                key={season}
                onClick={() => setSelectedSeason(season)}
                className={`px-3 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                  selectedSeason === season
                    ? "bg-stone-900 text-white font-semibold shadow-2xs"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                <Translate>{season}</Translate>
              </button>
            ))}
          </div>

          {/* Category Filter Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider shrink-0 font-bold">
              <Translate>THEME</Translate>:
            </span>
            {[
              { id: "All", label: "All Themes" },
              { id: "Flower & Nature", label: "Flower & Nature" },
              { id: "Traditional & Culture", label: "Traditional & Culture" },
              { id: "Food & Gourmet", label: "Food & Gourmet" },
              { id: "Night & Lights", label: "Night & Lights" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-sans transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? "bg-amber-100 text-amber-950 font-bold border border-amber-300"
                    : "bg-stone-50 text-stone-500 hover:bg-stone-100"
                }`}
              >
                <Translate>{cat.label}</Translate>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Festivals Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredFestivals.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="col-span-full py-16 text-center space-y-3 bg-white rounded-3xl border border-stone-200/60 p-8"
            >
              <AlertCircle className="w-10 h-10 text-stone-400 mx-auto" />
              <h3 className="font-display font-bold text-stone-700 text-base"><Translate>No Festivals Found</Translate></h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                <Translate>No celebrations match your current search and filter criteria. Try adjusting the season, region, or keyword.</Translate>
              </p>
            </motion.div>
          ) : (
            filteredFestivals.map((fest) => {
              const inWishlist = wishlist.includes(fest.id);
              const isCustom = fest.isCustom;

              return (
                <motion.div
                  layout
                  key={fest.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-3xl border border-stone-200/60 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Visual Card Header with Real Photorealistic Image */}
                    <div className="relative h-48 overflow-hidden bg-stone-900">
                      <img
                        src={fest.image}
                        alt={fest.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />

                      {/* Season & Region Badges */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                        <span className="text-[9px] font-mono uppercase tracking-wider font-bold bg-amber-400 text-stone-950 px-2.5 py-0.5 rounded-full shadow-xs">
                          <Translate>{fest.season}</Translate>
                        </span>
                        {fest.region && (
                          <span className="text-[9px] font-mono uppercase tracking-wider font-bold bg-white/80 backdrop-blur-md text-stone-900 px-2 py-0.5 rounded-full">
                            <Translate>{fest.region}</Translate>
                          </span>
                        )}
                        {fest.category && (
                          <span className="text-[9px] font-mono uppercase tracking-wider font-bold bg-stone-900/80 backdrop-blur-md text-stone-200 px-2 py-0.5 rounded-full border border-stone-700/50">
                            <Translate>{fest.category}</Translate>
                          </span>
                        )}
                        {isCustom && (
                          <span className="text-[9px] font-mono uppercase tracking-wider font-bold bg-purple-500 text-white px-2 py-0.5 rounded-full">
                            <Translate>Custom Event</Translate>
                          </span>
                        )}
                      </div>

                      {/* Action buttons on card header */}
                      <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                        {/* Admin edit & delete buttons */}
                        {isAdmin && (
                          <>
                            <button
                              onClick={() => handleStartEditFestival(fest)}
                              className="p-2 rounded-full bg-amber-500/95 text-stone-950 hover:bg-amber-400 transition-all cursor-pointer shadow-md"
                              title="축제 정보 수정 (관리자)"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteFestival(fest.id, fest.name)}
                              className="p-2 rounded-full bg-red-600/90 text-white hover:bg-red-700 transition-all cursor-pointer shadow-md"
                              title="축제 삭제 (관리자)"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}

                        {/* Favorite trigger button */}
                        <button
                          onClick={() => handleToggleWishlist(fest.id)}
                          className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                            inWishlist
                              ? "bg-rose-500 text-white hover:bg-rose-600"
                              : "bg-black/30 text-white hover:bg-black/55 hover:scale-105"
                          }`}
                        >
                          <Heart className="w-4 h-4 fill-current" />
                        </button>
                      </div>

                      {/* Bottom display banner */}
                      <div className="absolute bottom-3 left-4 right-4 text-white">
                        <span className="text-[9px] font-mono tracking-widest text-amber-300 uppercase block">
                          <Translate>{fest.dateRange}</Translate>
                        </span>
                        <h3 className="font-display font-bold text-base md:text-lg leading-tight mt-0.5 flex items-baseline gap-2">
                          {language === "ko" ? (
                            <>
                              <span>{fest.koreanName || fest.name}</span>
                              {fest.name && fest.name !== fest.koreanName && (
                                <span className="text-xs font-sans text-stone-300 font-normal">({fest.name})</span>
                              )}
                            </>
                          ) : (
                            <>
                              <span><Translate>{fest.name}</Translate></span>
                              {fest.koreanName && (
                                <span className="text-xs font-sans text-stone-300 font-normal">({fest.koreanName})</span>
                              )}
                            </>
                          )}
                        </h3>
                      </div>
                    </div>

                    <div className="p-5 space-y-4">
                      <p className="text-xs text-stone-600 leading-relaxed font-sans">
                        <Translate>{fest.description}</Translate>
                      </p>

                      <div className="text-[11px] font-sans bg-amber-50/55 border border-amber-100 p-2.5 rounded-xl flex gap-2">
                        <span className="font-semibold text-amber-800 uppercase shrink-0 font-mono">
                          <Translate>HIGHLIGHT</Translate>:
                        </span>
                        <p className="text-stone-700"><Translate>{fest.highlight}</Translate></p>
                      </div>

                      {/* Bullets */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {fest.features.map((feature, idx) => (
                          <span key={idx} className="text-[9px] font-mono bg-stone-50 text-stone-600 px-2.5 py-1 rounded-md border border-stone-100">
                            ✓ <Translate>{feature}</Translate>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    <span className="text-stone-500 flex items-center gap-1 font-sans">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      <Translate>{fest.location}</Translate>
                    </span>

                    {isAdmin && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleStartEditFestival(fest)}
                          className="text-stone-600 hover:text-amber-600 px-2.5 py-1 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-semibold"
                          title="축제 수정"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                          <span><Translate>수정</Translate></span>
                        </button>
                        <button
                          onClick={() => handleDeleteFestival(fest.id, fest.name)}
                          className="text-stone-400 hover:text-red-600 px-2.5 py-1 hover:bg-red-50 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
                          title="축제 삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span><Translate>삭제</Translate></span>
                        </button>
                      </div>
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

      {/* Modal: Add New Cultural Festival (Admin Only) */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-stone-200 max-w-xl w-full my-8 text-stone-950"
            >
              {/* Header */}
              <div className="bg-stone-900 text-white p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold">
                    {editingFestivalId ? <Edit3 className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg">
                      {editingFestivalId ? (
                        <Translate>축제 정보 수정</Translate>
                      ) : (
                        <Translate>전국 축제 수동 등록</Translate>
                      )}
                    </h3>
                    <p className="text-xs text-stone-300">
                      {editingFestivalId ? (
                        <Translate>기존 등록된 축제의 일정, 장소, 설명 및 대표 이미지를 수정합니다.</Translate>
                      ) : (
                        <Translate>관리자 권한으로 새로운 대한민국 축제를 등록합니다.</Translate>
                      )}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditingFestivalId(null);
                  }}
                  className="p-1 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSaveFestival} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
                {/* Names */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-stone-700">
                      축제 영문명 * (e.g. Yeongdo Hydrangea Festival)
                    </label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Yeongdo Hydrangea Festival"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-stone-700">
                      축제 한글명 * (e.g. 영도 수국 축제)
                    </label>
                    <input
                      type="text"
                      required
                      value={formKoreanName}
                      onChange={(e) => setFormKoreanName(e.target.value)}
                      placeholder="e.g. 영도 수국 축제"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                    />
                  </div>
                </div>

                {/* Season & Region & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-stone-700">
                      <Translate>계절</Translate> (Season) *
                    </label>
                    <select
                      value={formSeason}
                      onChange={(e) => {
                        const s = e.target.value as any;
                        setFormSeason(s);
                        setFormMonth(s === "Spring" ? 4 : s === "Summer" ? 7 : s === "Autumn" ? 10 : 1);
                      }}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none cursor-pointer"
                    >
                      <option value="Spring">{t("Spring") || "봄"}</option>
                      <option value="Summer">{t("Summer") || "여름"}</option>
                      <option value="Autumn">{t("Autumn") || "가을"}</option>
                      <option value="Winter">{t("Winter") || "겨울"}</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-stone-700">
                      <Translate>개최 권역</Translate> (Region)
                    </label>
                    <select
                      value={formRegion}
                      onChange={(e) => setFormRegion(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none cursor-pointer"
                    >
                      <option value="Seoul/Capital">{t("Seoul/Capital") || "서울/수도권"}</option>
                      <option value="Gangwon">{t("Gangwon") || "강원"}</option>
                      <option value="Chungcheong">{t("Chungcheong") || "충청"}</option>
                      <option value="Jeolla">{t("Jeolla") || "전라"}</option>
                      <option value="Gyeongsang">{t("Gyeongsang") || "경상"}</option>
                      <option value="Jeju">{t("Jeju") || "제주"}</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-stone-700">
                      <Translate>테마</Translate> (Category)
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none cursor-pointer"
                    >
                      <option value="Flower & Nature">{t("Flower & Nature") || "꽃 & 자연"}</option>
                      <option value="Traditional & Culture">{t("Traditional & Culture") || "전통 & 문화"}</option>
                      <option value="Food & Gourmet">{t("Food & Gourmet") || "음식 & 미식"}</option>
                      <option value="Night & Lights">{t("Night & Lights") || "야경 & 등불"}</option>
                      <option value="Winter & Ice">{t("Winter & Ice") || "겨울 & 얼음"}</option>
                    </select>
                  </div>
                </div>

                {/* Location & Date Range */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-stone-700">
                      <Translate>개최 장소</Translate> * (Location)
                    </label>
                    <input
                      type="text"
                      required
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      placeholder="e.g. Taejongdae, Busan"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-stone-700">
                      <Translate>개최 기간</Translate> * (Date Range)
                    </label>
                    <input
                      type="text"
                      required
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      placeholder="e.g. Early June"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-stone-700">
                    <Translate>축제 상세 설명</Translate> * (Description)
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    placeholder="축제의 역사, 행사 내용, 즐길거리를 자세히 적어주세요."
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-400/50 resize-none"
                  />
                </div>

                {/* Real Photo Image Direct Upload / URL / Presets (Compliant with AGENTS.md) */}
                <ImageUploader
                  value={formImage}
                  onChange={setFormImage}
                  presets={REAL_FESTIVAL_PRESETS}
                  label="고화질 실사 축제 사진 (Real Photo)"
                  recommendedAspect="16:9 권장"
                />

                {/* Highlight & Features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-stone-700">대표 하이라이트 (Highlight)</label>
                    <input
                      type="text"
                      value={formHighlight}
                      onChange={(e) => setFormHighlight(e.target.value)}
                      placeholder="e.g. 수국 꽃 터널 산책 및 야간 조명쇼"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-stone-700">주요 프로그램 태그 (쉼표 구분)</label>
                    <input
                      type="text"
                      value={formFeatures}
                      onChange={(e) => setFormFeatures(e.target.value)}
                      placeholder="e.g. 수국 화분 만들기, 버스킹 공연, 먹거리 장터"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Footer buttons */}
                <div className="pt-3 flex justify-end gap-2 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsFormOpen(false);
                      setEditingFestivalId(null);
                    }}
                    className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    <Translate>취소</Translate>
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-stone-950 hover:bg-stone-850 text-white font-semibold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    {editingFestivalId ? (
                      <>
                        <Check className="w-4 h-4 text-amber-400" />
                        <span><Translate>수정 내용 저장</Translate></span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 text-amber-400" />
                        <span><Translate>축제 등록 완료</Translate></span>
                      </>
                    )}
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
