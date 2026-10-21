import React, { useState, useMemo, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  MapPin, 
  Compass, 
  Landmark, 
  Star, 
  ChevronRight, 
  Ticket, 
  Plus, 
  Trash2, 
  X, 
  ShieldCheck, 
  Image as ImageIcon, 
  Check, 
  Coffee, 
  Sunrise, 
  AlertCircle 
} from "lucide-react";
import { DESTINATIONS } from "../data";
import { Destination } from "../types";
import { useTranslatedData, useTranslation, Translate } from "../context/LanguageContext";
import { useAdmin } from "../context/AdminContext";
import { 
  getCustomDestinations, 
  getDeletedDestinationIds, 
  addDestination, 
  deleteDestination 
} from "../services/dataStorage";
import ImageUploader, { ImagePreset } from "./ImageUploader";

// Curated high-resolution photorealistic image presets for Korea destinations (compliant with AGENTS.md real-photo rule)
const REAL_PHOTO_PRESETS: ImagePreset[] = [
  {
    label: "Jeonju Hanok Village",
    koreanLabel: "전주 한옥마을",
    url: "https://images.unsplash.com/photo-1578637387939-43c525550085?q=80&w=1200&auto=format&fit=crop",
  },
  {
    label: "Gangneung Coastline",
    koreanLabel: "강릉 안목해변",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
  },
  {
    label: "Damyang Juknokwon",
    koreanLabel: "담양 죽녹원 대나무숲",
    url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1200&auto=format&fit=crop",
  },
  {
    label: "Suncheon Bay",
    koreanLabel: "순천만 국가정원",
    url: "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1200&auto=format&fit=crop",
  },
  {
    label: "Seoraksan Mountain",
    koreanLabel: "설악산 국립공원",
    url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function PlacesView() {
  const { language, t } = useTranslation();
  const { isAdmin, adminToken, setShowLoginModal } = useAdmin();

  const [selectedCityId, setSelectedCityId] = useState<string>("seoul");
  const [itineraryStyle, setItineraryStyle] = useState<"heritage" | "modern" | "gourmet">("heritage");

  // Custom destinations and deletions
  const [customDestinations, setCustomDestinations] = useState<Destination[]>([]);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Form states for adding a new destination
  const [formName, setFormName] = useState("");
  const [formKoreanName, setFormKoreanName] = useState("");
  const [formTagline, setFormTagline] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formCoverImage, setFormCoverImage] = useState(REAL_PHOTO_PRESETS[0].url);
  const [formHighlights, setFormHighlights] = useState("");
  const [formBestTime, setFormBestTime] = useState("");
  const [formMustTry, setFormMustTry] = useState("");
  const [formHiddenGem, setFormHiddenGem] = useState("");
  const [formAttractionName, setFormAttractionName] = useState("");
  const [formAttractionDesc, setFormAttractionDesc] = useState("");
  const [formAttractionImage, setFormAttractionImage] = useState(REAL_PHOTO_PRESETS[0].url);

  // Load custom and deleted data
  useEffect(() => {
    getCustomDestinations().then(setCustomDestinations);
    setDeletedIds(getDeletedDestinationIds());
  }, []);

  // Combined destinations list
  const mergedDestinations = useMemo(() => {
    const defaults = DESTINATIONS.filter((d) => !deletedIds.includes(d.id));
    const customs = customDestinations.filter((d) => !deletedIds.includes(d.id));
    const list = [...defaults, ...customs];
    return list.length > 0 ? list : DESTINATIONS.slice(0, 1);
  }, [deletedIds, customDestinations]);

  // Translate destination data dynamically
  const { translatedData: translatedDestinations } = useTranslatedData(mergedDestinations, [
    "name",
    "tagline",
    "description",
    "highlights",
    "attractions",
    "travelTips",
  ]);

  // Ensure selectedCityId exists in translatedDestinations
  const currentCity = useMemo(() => {
    const found = translatedDestinations.find((d) => d.id === selectedCityId);
    return found || translatedDestinations[0] || DESTINATIONS[0];
  }, [translatedDestinations, selectedCityId]);

  // Dynamic Day Itinerary Database based on City & Travel Style
  const customItineraries: Record<string, Record<string, { time: string; activity: string; desc: string; icon: string }[]>> = {
    seoul: {
      heritage: [
        { time: "09:00 AM", activity: "Hanbok Walk in Gyeongbokgung", desc: "Rent traditional Korean silks and walk through the royal gates of Gyeongbokgung for free admission.", icon: "Landmark" },
        { time: "01:00 PM", activity: "Traditional Lunch in Insadong", desc: "Sip wild lotus root teas and enjoy traditional vegan temple delicacies at Sanchon.", icon: "Coffee" },
        { time: "05:00 PM", activity: "Sunset over Bukchon Hanok", desc: "Climb the gentle slopes of Bukchon to see rooftops of wooden Hanok houses against modern skylines.", icon: "Sunrise" },
      ],
      modern: [
        { time: "10:00 AM", activity: "Dongdaemun Design Plaza (DDP)", desc: "Walk through the breathtaking silver curves of the Zaha Hadid spaceship museum.", icon: "Compass" },
        { time: "02:00 PM", activity: "Shopping & Tech in Gangnam", desc: "Explore the giant multi-story libraries, underground malls, and advanced AI hubs.", icon: "Star" },
        { time: "07:00 PM", activity: "Han River Park Chimaek Session", desc: "Have crispy Korean fried chicken and local beer delivered directly to your picnic blanket.", icon: "Coffee" },
      ],
      gourmet: [
        { time: "09:30 AM", activity: "Breakfast at Gwangjang Market", desc: "Eat warm, crispy mung bean pancakes (bindaetteok) and hand-cut noodles (kalguksu).", icon: "Coffee" },
        { time: "02:00 PM", activity: "Traditional Tea in Bukchon", desc: "Relax inside a quiet courtyard of an ancient Hanok cafe tasting sweet rice cakes.", icon: "Coffee" },
        { time: "06:30 PM", activity: "Myeongdong Night Food Market", desc: "Walk down neon alleys sampling grilled lobster tails, hotteok, and tteokbokki skewered on sticks.", icon: "Star" },
      ],
    },
    jeju: {
      heritage: [
        { time: "08:30 AM", activity: "UNESCO Sunrise Hike", desc: "Climb the green basalt staircase of Seongsan Ilchulbong before crowds arrive.", icon: "Sunrise" },
        { time: "01:00 PM", activity: "Haenyeo Seafood Feast", desc: "Watch historic female divers harvest abalone and eat them fresh off the rocky shores.", icon: "Landmark" },
        { time: "04:30 PM", activity: "Manjanggul Lava Tube Hike", desc: "Escape the heat inside one of the world's longest, dark volcanic lava structures.", icon: "Compass" },
      ],
      modern: [
        { time: "09:30 AM", activity: "Jeju Aerospace & Robotics Museum", desc: "Interact with aviation simulations and smart eco-tourism stations.", icon: "Compass" },
        { time: "01:30 PM", activity: "Arte Museum Immersive Art", desc: "Wander through massive projection chambers displaying digital waterfalls and cosmic gardens.", icon: "Star" },
        { time: "06:00 PM", activity: "Sunset Drink at Cliffside Cafe", desc: "Listen to chill house beats overlooking the dynamic waves of Jungmun Beach.", icon: "Coffee" },
      ],
      gourmet: [
        { time: "09:00 AM", activity: "Sweet Hallabong Orange Pick", desc: "Sip fresh cold orange juice directly inside a scenic local orchid farm.", icon: "Coffee" },
        { time: "01:00 PM", activity: "Local Hairtail Fish Stew", desc: "Devour an epic 3-foot long silver haetail fish boiled slowly with chilies and radishes.", icon: "Coffee" },
        { time: "06:00 PM", activity: "Jeju Black Pork Barbecue", desc: "Roast thick, incredibly tender cuts of local black pork over real charcoal pits.", icon: "Coffee" },
      ],
    },
    gyeongju: {
      heritage: [
        { time: "09:00 AM", activity: "Royal Silla Tombs (Daereungwon)", desc: "Wander around monumental green grass hills housing golden crowns of ancient kings.", icon: "Landmark" },
        { time: "01:00 PM", activity: "Seokguram Grotto Buddhist Sanctuary", desc: "Hike up mountain forests to see the sacred stone Buddha looking out to the East Sea.", icon: "Sunrise" },
        { time: "07:30 PM", activity: "Donggung Palace Reflecting Pool", desc: "Watch the spectacular gold lighting outline the pavilion over the reflecting Wolji pond.", icon: "Star" },
      ],
      modern: [
        { time: "10:00 AM", activity: "Gyeongju Expo Park & Tower", desc: "Ride the glass elevator of a futuristic tower shaped like a hollow pagoda.", icon: "Compass" },
        { time: "02:00 PM", activity: "Hwangnidang-gil Cafe Walk", desc: "Explore the trendiest block of classic Hanok buildings turned into design shops.", icon: "Coffee" },
        { time: "06:00 PM", activity: "Bespoke Pottery Ceramic Work", desc: "Mould clay under the guidance of traditional Silla glaze masters.", icon: "Star" },
      ],
      gourmet: [
        { time: "09:30 AM", activity: "Ssambap Traditional Table", desc: "Dine on over 30 different side dishes (banchan) wrapped in organic mountain greens.", icon: "Coffee" },
        { time: "02:00 PM", activity: "Hwangnam Red Bean Pastry", desc: "Eat warm, sweet, local Hwangnam breads fresh from historical bakery ovens.", icon: "Coffee" },
        { time: "06:30 PM", activity: "Royal Han-jeongsik Dinner", desc: "Experience a slow, 12-course banquet modeled after Silla court feasts.", icon: "Coffee" },
      ],
    },
    busan: {
      heritage: [
        { time: "09:00 AM", activity: "Haedong Yonggungsa Ocean Temple", desc: "Walk down rocky paths to visit a rare Buddhist temple hanging directly over crushing waves.", icon: "Landmark" },
        { time: "01:00 PM", activity: "Busan Jagalchi Fish Market", desc: "Select live seafood on the first floor and have them steamed immediately upstairs.", icon: "Coffee" },
        { time: "04:30 PM", activity: "Beomeosa Temple Mountain Hike", desc: "Escape to peaceful pine forests guarding ancient colorful Buddhist gates.", icon: "Sunrise" },
      ],
      modern: [
        { time: "10:00 AM", activity: "Haeundae Beach Sky Capsule", desc: "Ride a cute, colorful capsule train gliding high on scenic coastal tracks over the sea.", icon: "Compass" },
        { time: "02:00 PM", activity: "Gamcheon Artistic Village", desc: "Walk through vibrant hillsides packed with murals, sculptures, and quiet cafes.", icon: "Star" },
        { time: "07:30 PM", activity: "Gwangan Bridge Diamond Light Show", desc: "Drink wine at beachfront pubs watching the world's longest dynamic suspension bridge light show.", icon: "Star" },
      ],
      gourmet: [
        { time: "09:00 AM", activity: "Warm Pork Broth Rice Bowl", desc: "Dine on hearty Dwaeji Gukbap, Busan's ultimate hangover comfort dish.", icon: "Coffee" },
        { time: "01:30 PM", activity: "Ssiat Hotteok in BIFF Square", desc: "Chew on a hot brown sugar pancake stuffed with roasted pumpkin and sunflower seeds.", icon: "Coffee" },
        { time: "06:30 PM", activity: "Grilled Clams on Taejongdae Pebbles", desc: "Roast fresh scallops with butter and hot sauce over roaring open-flame grills.", icon: "Coffee" },
      ],
    },
  };

  // Default itinerary generator for newly added custom destinations
  const rawItinerary = useMemo(() => {
    if (customItineraries[currentCity?.id]) {
      return customItineraries[currentCity.id][itineraryStyle] || [];
    }
    // Generated tailored itinerary for custom place
    return [
      {
        time: "10:00 AM",
        activity: `${currentCity.name} Morning Stroll`,
        desc: `Discover the iconic local charm and scenic landscapes of ${currentCity.name}.`,
        icon: "Compass",
      },
      {
        time: "01:00 PM",
        activity: `Authentic Local Flavors`,
        desc: `Savor the region's culinary specialties: ${currentCity.travelTips?.mustTry || "Traditional local dish"}.`,
        icon: "Coffee",
      },
      {
        time: "05:00 PM",
        activity: `${currentCity.travelTips?.hiddenGem || "Hidden Gem Discovery"}`,
        desc: `Immerse in the calm sunset atmosphere at local secret vantage points.`,
        icon: "Sunrise",
      },
    ];
  }, [currentCity, itineraryStyle]);

  // Translate current active itinerary on the fly
  const { translatedData: activeItinerary } = useTranslatedData(rawItinerary, ["activity", "desc"]);

  // Handler: Add new destination
  const handleAddDestination = async (e: FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formKoreanName.trim()) {
      alert("도시/명소 영문 이름과 한글 이름을 입력해 주세요.");
      return;
    }

    const highlightsArray = formHighlights
      .split(",")
      .map((h) => h.trim())
      .filter(Boolean);

    const newDest: Destination = {
      id: "dest_" + Date.now(),
      name: formName.trim(),
      koreanName: formKoreanName.trim(),
      tagline: formTagline.trim() || `${formName} - Timeless Korean Wonder`,
      description: formDescription.trim() || `${formName} offers rich cultural encounters and breathtaking natural scenery.`,
      coverImage: formCoverImage.trim(),
      locationLabel: formLocation.trim() || "Republic of Korea",
      highlights: highlightsArray.length > 0 ? highlightsArray : ["Scenic Vistas", "Historic Architecture", "Local Cuisine"],
      travelTips: {
        bestTime: formBestTime.trim() || "Spring & Autumn",
        mustTry: formMustTry.trim() || "Traditional Regional Specialties",
        hiddenGem: formHiddenGem.trim() || "Tranquil local alleyways & historic paths",
      },
      attractions: [
        {
          name: formAttractionName.trim() || `${formName} Primary Landmark`,
          desc: formAttractionDesc.trim() || `The most famous cultural and scenic highlight of ${formName}.`,
          image: formAttractionImage.trim() || formCoverImage.trim(),
        },
      ],
      isCustom: true,
    };

    const saved = await addDestination(newDest, adminToken);
    setCustomDestinations((prev) => [...prev.filter((d) => d.id !== saved.id), saved]);
    setSelectedCityId(saved.id);
    setIsAddModalOpen(false);

    // Reset form
    setFormName("");
    setFormKoreanName("");
    setFormTagline("");
    setFormDescription("");
    setFormLocation("");
    setFormHighlights("");
    setFormBestTime("");
    setFormMustTry("");
    setFormHiddenGem("");
    setFormAttractionName("");
    setFormAttractionDesc("");

    setActionNotice(`'${saved.name} (${saved.koreanName})' 명소가 추천명소에 추가되었습니다!`);
    setTimeout(() => setActionNotice(null), 3500);
  };

  // Handler: Delete destination
  const handleDeleteCity = async (cityId: string, cityName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(`'${cityName}' 추천명소를 삭제하시겠습니까?`)) {
      return;
    }

    await deleteDestination(cityId, adminToken);
    setDeletedIds((prev) => [...prev, cityId]);
    setCustomDestinations((prev) => prev.filter((d) => d.id !== cityId));

    if (selectedCityId === cityId) {
      const remaining = mergedDestinations.filter((d) => d.id !== cityId);
      if (remaining.length > 0) {
        setSelectedCityId(remaining[0].id);
      }
    }

    setActionNotice(`'${cityName}' 명소가 삭제되었습니다.`);
    setTimeout(() => setActionNotice(null), 3500);
  };

  return (
    <div className="space-y-12">
      {/* Page Header */}
      <section className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 bg-teal-100 text-teal-950 border border-teal-200/50 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider">
          <MapPin className="w-3.5 h-3.5 text-teal-700" />
          <Translate>Beyond the Ordinary</Translate>
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-stone-900">
          <Translate>Curated Destinations of South Korea</Translate>
        </h1>
        <p className="text-xs md:text-sm text-stone-500 font-sans leading-relaxed">
          <Translate>Traverse legendary cultural capitals—from neon sky-high metropolises to volcanic wonders and historical king tombs.</Translate>
        </p>

        {/* Admin status pill & actions */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
          {isAdmin ? (
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-300 px-3 py-1.5 rounded-full text-xs text-amber-900">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span className="font-semibold"><Translate>관리자 모드 활성화</Translate></span>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="ml-1 bg-stone-900 hover:bg-stone-850 text-white px-3 py-1 rounded-full text-[11px] font-medium flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
              >
                <Plus className="w-3 h-3 text-amber-400" />
                <span><Translate>추천명소 추가</Translate></span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1.5 bg-white border border-stone-200/80 hover:border-stone-400 px-3 py-1.5 rounded-full transition-all cursor-pointer shadow-2xs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
              <span><Translate>관리자로 로그인하여 명소 추가/삭제</Translate></span>
            </button>
          )}
        </div>

        {/* Action Notice Toast */}
        {actionNotice && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-2.5 bg-stone-900 text-amber-400 border border-amber-400/30 rounded-xl text-xs font-medium inline-flex items-center gap-2 shadow-lg"
          >
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{actionNotice}</span>
          </motion.div>
        )}
      </section>

      {/* City Navigator Tabs */}
      <section className="flex flex-col md:flex-row gap-6">
        {/* Left Side: City Buttons */}
        <div className="md:w-1/4 flex flex-col gap-2">
          {translatedDestinations.map((city) => (
            <div key={city.id} className="relative group">
              <button
                onClick={() => setSelectedCityId(city.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                  selectedCityId === city.id
                    ? "bg-stone-900 text-white border-stone-950 shadow-md"
                    : "bg-white text-stone-600 border-stone-200/60 hover:bg-stone-50"
                }`}
              >
                <div>
                  <span className="text-[10px] font-mono block uppercase tracking-wider opacity-60">
                    {language === "ko" ? city.name : city.koreanName}
                  </span>
                  <h3 className="font-display font-bold text-sm md:text-base mt-0.5">
                    {language === "ko" ? (city.koreanName || city.name) : <Translate>{city.name}</Translate>}
                  </h3>
                </div>
                <div className="flex items-center gap-1.5">
                  {isAdmin && (
                    <button
                      onClick={(e) => handleDeleteCity(city.id, city.name, e)}
                      title="명소 삭제 (관리자)"
                      className="p-1.5 rounded-lg text-red-400 hover:text-white hover:bg-red-600/80 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      selectedCityId === city.id ? "translate-x-1 text-white" : "text-stone-400 group-hover:translate-x-1"
                    }`}
                  />
                </div>
              </button>
            </div>
          ))}

          {/* Quick Add Button on Left Column when Admin */}
          {isAdmin && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="w-full p-3.5 rounded-2xl border-2 border-dashed border-stone-300 hover:border-amber-500 text-stone-600 hover:text-stone-950 flex items-center justify-center gap-2 text-xs font-semibold transition-all cursor-pointer bg-white/50 hover:bg-amber-50/30"
            >
              <Plus className="w-4 h-4 text-amber-600" />
              <span><Translate>+ 새 추천명소 추가</Translate></span>
            </button>
          )}
        </div>

        {/* Right Side: Selected City Highlights Banner */}
        <div className="md:w-3/4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCity.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl border border-stone-200/60 overflow-hidden shadow-xs"
            >
              <div className="relative h-56 md:h-72 overflow-hidden">
                <img
                  src={currentCity.coverImage}
                  alt={currentCity.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />
                <span className="absolute top-4 left-4 text-[9px] font-mono bg-white/10 backdrop-blur-md border border-white/20 text-white px-3 py-1 rounded-full uppercase">
                  <Translate>{currentCity.locationLabel}</Translate>
                </span>

                {isAdmin && (
                  <button
                    onClick={(e) => handleDeleteCity(currentCity.id, currentCity.name, e)}
                    className="absolute top-4 right-4 bg-red-600/90 hover:bg-red-700 text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 backdrop-blur-xs transition-colors cursor-pointer shadow-md"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span><Translate>이 명소 삭제</Translate></span>
                  </button>
                )}

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h2 className="text-xl md:text-2xl font-display font-bold flex items-baseline gap-2">
                    {language === "ko" ? (
                      <>
                        <span>{currentCity.koreanName || currentCity.name}</span>
                        {currentCity.name && currentCity.name !== currentCity.koreanName && (
                          <span className="text-xs font-sans text-stone-300 font-normal">({currentCity.name})</span>
                        )}
                      </>
                    ) : (
                      <>
                        <span><Translate>{currentCity.name}</Translate></span>
                        {currentCity.koreanName && (
                          <span className="text-xs font-sans text-stone-300 font-normal">({currentCity.koreanName})</span>
                        )}
                      </>
                    )}
                  </h2>
                  <p className="text-xs text-stone-200 italic mt-1">
                    "<Translate>{currentCity.tagline}</Translate>"
                  </p>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <h4 className="text-[10px] font-mono text-stone-400 uppercase tracking-widest"><Translate>Introduction</Translate></h4>
                  <p className="text-xs text-stone-600 leading-relaxed font-sans">
                    <Translate>{currentCity.description}</Translate>
                  </p>
                </div>

                {/* Key Highlights Grid */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  {currentCity.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center gap-2 bg-stone-50 border border-stone-200/30 p-2.5 rounded-xl">
                      <Star className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="text-[11px] font-sans font-medium text-stone-700">
                        <Translate>{highlight}</Translate>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Selected City Attractions Detail Grid */}
      <section className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl md:text-2xl font-display font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <Landmark className="w-5 h-5 text-stone-800" />
            <Translate>Top Curated Sights & Landmarks</Translate>
          </h2>
          <p className="text-xs text-stone-500">
            <Translate>Must-see architectural, artistic, and natural locations in</Translate>{" "}
            {language === "ko" ? (currentCity.koreanName || currentCity.name) : <Translate>{currentCity.name}</Translate>}.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentCity.attractions.map((attraction, i) => (
            <div key={i} className="bg-white rounded-3xl border border-stone-200/60 overflow-hidden shadow-2xs flex flex-col justify-between">
              <div>
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={attraction.image}
                    alt={attraction.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 to-transparent" />
                </div>
                <div className="p-5 space-y-1.5">
                  <h3 className="font-display font-bold text-stone-900 text-sm">
                    <Translate>{attraction.name}</Translate>
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed font-sans">
                    <Translate>{attraction.desc}</Translate>
                  </p>
                </div>
              </div>
              <div className="px-5 pb-5 pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[10px] font-mono text-stone-400"><Translate>Excursion Area</Translate></span>
                <span className="text-[10px] font-mono text-teal-600 font-semibold uppercase flex items-center gap-1">
                  <Ticket className="w-3.5 h-3.5" /> <Translate>Entry Ticket Required</Translate>
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Travel Tips Dashboard */}
      <section className="bg-white rounded-3xl p-6 border border-stone-200/60 shadow-xs space-y-6">
        <div className="space-y-1">
          <h3 className="font-display font-bold text-stone-900 text-base"><Translate>Travel Intelligence Dashboard</Translate></h3>
          <p className="text-[11px] text-stone-500">
            <Translate>Important local travel data tailored specifically for</Translate>{" "}
            {language === "ko" ? (currentCity.koreanName || currentCity.name) : <Translate>{currentCity.name}</Translate>}.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100/60 space-y-2">
            <span className="text-[10px] text-amber-800 font-mono font-semibold uppercase tracking-wider block"><Translate>Best Time to Visit</Translate></span>
            <p className="text-stone-700 leading-relaxed font-sans">
              <Translate>{currentCity.travelTips?.bestTime || "Spring & Autumn"}</Translate>
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100/60 space-y-2">
            <span className="text-[10px] text-rose-800 font-mono font-semibold uppercase tracking-wider block"><Translate>Must-Try Gourmet</Translate></span>
            <p className="text-stone-700 leading-relaxed font-sans">
              <Translate>{currentCity.travelTips?.mustTry || "Local cuisine specialties"}</Translate>
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-100/60 space-y-2">
            <span className="text-[10px] text-teal-800 font-mono font-semibold uppercase tracking-wider block"><Translate>Hidden Gem</Translate></span>
            <p className="text-stone-700 leading-relaxed font-sans">
              <Translate>{currentCity.travelTips?.hiddenGem || "Secret scenic trail"}</Translate>
            </p>
          </div>
        </div>
      </section>

      {/* Interactive 24-Hour Day Designer */}
      <section className="bg-stone-950 text-white rounded-3xl p-6 md:p-8 border border-stone-850 space-y-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-6">
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-widest text-teal-400 uppercase"><Translate>Smart Travel Planner</Translate></span>
            <h3 className="text-lg md:text-xl font-display font-bold">
              <Translate>24-Hour Curated Itinerary</Translate>: {language === "ko" ? (currentCity.koreanName || currentCity.name) : <Translate>{currentCity.name}</Translate>}
            </h3>
            <p className="text-xs text-stone-400 font-sans"><Translate>Pick your personal exploration style to reconfigure the day.</Translate></p>
          </div>

          {/* Style Selector Tabs */}
          <div className="flex bg-stone-900 p-1 rounded-xl border border-stone-800">
            {(["heritage", "modern", "gourmet"] as const).map((style) => (
              <button
                key={style}
                onClick={() => setItineraryStyle(style)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium capitalize transition-all cursor-pointer ${
                  itineraryStyle === style
                    ? "bg-teal-500 text-stone-950 font-semibold shadow-xs"
                    : "text-stone-400 hover:text-white"
                }`}
              >
                <Translate>{style}</Translate>
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Itinerary steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {activeItinerary.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-stone-900/60 p-5 rounded-2xl border border-stone-800/80 hover:border-stone-700/80 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono bg-teal-500/10 text-teal-400 border border-teal-500/20 px-2.5 py-0.5 rounded-full font-semibold">
                    {step.time}
                  </span>
                  <span className="text-[9px] font-mono text-stone-500"><Translate>Step</Translate> {idx + 1}</span>
                </div>
                <h4 className="font-display font-bold text-xs md:text-sm text-white">{step.activity}</h4>
                <p className="text-[11px] text-stone-400 leading-relaxed font-sans">{step.desc}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-850 flex items-center justify-between text-[9px] font-mono text-stone-500">
                <span><Translate>Travel Style</Translate></span>
                <span className="text-teal-400 capitalize"><Translate>{itineraryStyle}</Translate></span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Modal: Add New Destination (Admin Only) */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              className="bg-white rounded-3xl shadow-2xl border border-stone-200 max-w-2xl w-full my-8 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-stone-900 text-white p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-teal-400 text-stone-950 flex items-center justify-center font-bold">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg"><Translate>새 추천명소 수동 등록</Translate></h3>
                    <p className="text-xs text-stone-300"><Translate>대한민국의 새로운 명소를 등록하여 여행자들에게 선보입니다.</Translate></p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleAddDestination} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
                {/* Names */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-700">
                      영문 명소/도시명 * (e.g. Jeonju, Gangneung)
                    </label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Jeonju"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-teal-400 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-700">
                      한글 명소/도시명 * (e.g. 전주, 강릉)
                    </label>
                    <input
                      type="text"
                      required
                      value={formKoreanName}
                      onChange={(e) => setFormKoreanName(e.target.value)}
                      placeholder="e.g. 전주"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-teal-400 outline-none"
                    />
                  </div>
                </div>

                {/* Tagline & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-700">슬로건 / 한줄 소개 (Tagline)</label>
                    <input
                      type="text"
                      value={formTagline}
                      onChange={(e) => setFormTagline(e.target.value)}
                      placeholder="e.g. UNESCO Gastronomy Capital & Historic Hanok Alleys"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-teal-400 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-700">위치 / 좌표 (Location Label)</label>
                    <input
                      type="text"
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      placeholder="e.g. 35.8242° N, 127.1480° E (Jeolla)"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-teal-400 outline-none"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">상세 설명 (Description)</label>
                  <textarea
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="해당 명소의 역사, 풍경, 문화적 가치에 대한 설명을 적어주세요."
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-teal-400 outline-none resize-none"
                  />
                </div>

                {/* Real Photo Cover Image Direct Upload / URL / Presets (Strict adherence to AGENTS.md) */}
                <ImageUploader
                  value={formCoverImage}
                  onChange={(val) => {
                    setFormCoverImage(val);
                    if (!formAttractionImage) {
                      setFormAttractionImage(val);
                    }
                  }}
                  presets={REAL_PHOTO_PRESETS}
                  label="고화질 실사 명소 대표 사진 (Real Photo)"
                  recommendedAspect="16:9 권장"
                />

                {/* Highlights */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">주요 특징 태그 (쉼표로 구분)</label>
                  <input
                    type="text"
                    value={formHighlights}
                    onChange={(e) => setFormHighlights(e.target.value)}
                    placeholder="e.g. 한옥마을, 야간 산책, 전통 막걸리 골목, 전주 비빔밥"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-teal-400 outline-none"
                  />
                </div>

                {/* Travel Tips: Best Time, Must Try, Hidden Gem */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-700">방문 추천 시기</label>
                    <input
                      type="text"
                      value={formBestTime}
                      onChange={(e) => setFormBestTime(e.target.value)}
                      placeholder="e.g. 10월~11월 가을 단풍철"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-400 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-700">대표 먹거리 (Must Try)</label>
                    <input
                      type="text"
                      value={formMustTry}
                      onChange={(e) => setFormMustTry(e.target.value)}
                      placeholder="e.g. 전주 전통비빔밥, 수제 초코파이"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-400 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-700">숨은 명소 (Hidden Gem)</label>
                    <input
                      type="text"
                      value={formHiddenGem}
                      onChange={(e) => setFormHiddenGem(e.target.value)}
                      placeholder="e.g. 오목대 언덕 한옥 기와지붕 전망"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-400 outline-none"
                    />
                  </div>
                </div>

                {/* Primary Attraction */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                  <span className="text-xs font-bold text-stone-800 block">대표 랜드마크 스팟 1곳 등록</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-stone-600">스팟 이름</label>
                      <input
                        type="text"
                        value={formAttractionName}
                        onChange={(e) => setFormAttractionName(e.target.value)}
                        placeholder="e.g. 전주 한옥마을 경기전"
                        className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-xs outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-stone-600">스팟 설명</label>
                      <input
                        type="text"
                        value={formAttractionDesc}
                        onChange={(e) => setFormAttractionDesc(e.target.value)}
                        placeholder="e.g. 태조 이성계의 어진을 모신 역사적인 사당"
                        className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-xs outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-2 flex justify-end gap-3 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl text-xs font-medium text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
                  >
                    <Translate>취소</Translate>
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-stone-900 hover:bg-stone-850 text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                  >
                    <Plus className="w-4 h-4 text-teal-400" />
                    <span><Translate>추천명소 등록 완료</Translate></span>
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
