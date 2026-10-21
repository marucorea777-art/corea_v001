import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Compass, Landmark, Star, ChevronRight, Ticket } from "lucide-react";
import { DESTINATIONS } from "../data";
import { useTranslatedData, useTranslation, Translate } from "../context/LanguageContext";

export default function PlacesView() {
  const { language, t } = useTranslation();
  const [selectedCityId, setSelectedCityId] = useState<string>("seoul");
  const [itineraryStyle, setItineraryStyle] = useState<"heritage" | "modern" | "gourmet">("heritage");

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

  // Translate static destination data dynamically
  const { translatedData: translatedDestinations } = useTranslatedData(DESTINATIONS, [
    "name",
    "tagline",
    "description",
    "highlights",
    "attractions",
    "travelTips"
  ]);

  const currentCity = useMemo(() => {
    return translatedDestinations.find(d => d.id === selectedCityId) || translatedDestinations[0];
  }, [translatedDestinations, selectedCityId]);

  const rawItinerary = useMemo(() => {
    return customItineraries[currentCity?.id || "seoul"]?.[itineraryStyle] || [];
  }, [currentCity, itineraryStyle]);

  // Translate current active itinerary on the fly
  const { translatedData: activeItinerary } = useTranslatedData(rawItinerary, ["activity", "desc"]);

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
          <Translate>Traverse four legendary cultural capitals—from neon sky-high metropolises to volcanic wonders and historical king tombs.</Translate>
        </p>
      </section>

      {/* City Navigator Tabs */}
      <section className="flex flex-col md:flex-row gap-6">
        {/* Left Side: City Buttons */}
        <div className="md:w-1/4 flex flex-col gap-2">
          {translatedDestinations.map((city) => (
            <button
              key={city.id}
              onClick={() => setSelectedCityId(city.id)}
              className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between group cursor-pointer ${
                selectedCityId === city.id
                  ? "bg-stone-900 text-white border-stone-950 shadow-md"
                  : "bg-white text-stone-600 border-stone-200/60 hover:bg-stone-50"
              }`}
            >
              <div>
                <span className="text-[10px] font-mono block uppercase tracking-wider opacity-60">
                  {city.koreanName}
                </span>
                <h3 className="font-display font-bold text-sm md:text-base mt-0.5">{city.name}</h3>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${selectedCityId === city.id ? "translate-x-1 text-white" : "text-stone-400 group-hover:translate-x-1"}`} />
            </button>
          ))}
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
                  {currentCity.locationLabel}
                </span>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h2 className="text-xl md:text-2xl font-display font-bold flex items-baseline gap-2">
                    {currentCity.name}
                    <span className="text-xs font-sans text-stone-300 font-normal">({cityKoreanName(currentCity.id)})</span>
                  </h2>
                  <p className="text-xs text-stone-200 italic mt-1">
                    "{currentCity.tagline}"
                  </p>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <h4 className="text-[10px] font-mono text-stone-400 uppercase tracking-widest"><Translate>Introduction</Translate></h4>
                  <p className="text-xs text-stone-600 leading-relaxed font-sans">
                    {currentCity.description}
                  </p>
                </div>

                {/* Key Highlights Grid */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  {currentCity.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center gap-2 bg-stone-50 border border-stone-200/30 p-2.5 rounded-xl">
                      <Star className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="text-[11px] font-sans font-medium text-stone-700">{highlight}</span>
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
          <p className="text-xs text-stone-500"><Translate>Must-see architectural, artistic, and natural locations in</Translate> {currentCity.name}.</p>
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
                  <h3 className="font-display font-bold text-stone-900 text-sm">{attraction.name}</h3>
                  <p className="text-xs text-stone-500 leading-relaxed font-sans">{attraction.desc}</p>
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
          <p className="text-[11px] text-stone-500"><Translate>Important local travel data tailored specifically for</Translate> {currentCity.name}.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100/60 space-y-2">
            <span className="text-[10px] text-amber-800 font-mono font-semibold uppercase tracking-wider block"><Translate>Best Time to Visit</Translate></span>
            <p className="text-stone-700 leading-relaxed font-sans">{currentCity.travelTips.bestTime}</p>
          </div>
          <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-100/60 space-y-2">
            <span className="text-[10px] text-teal-800 font-mono font-semibold uppercase tracking-wider block"><Translate>Must-Try Culinary/Activity</Translate></span>
            <p className="text-stone-700 leading-relaxed font-sans">{currentCity.travelTips.mustTry}</p>
          </div>
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/60 space-y-2">
            <span className="text-[10px] text-stone-500 font-mono font-semibold uppercase tracking-wider block"><Translate>Local Hidden Gem</Translate></span>
            <p className="text-stone-700 leading-relaxed font-sans">{currentCity.travelTips.hiddenGem}</p>
          </div>
        </div>
      </section>

      {/* Interactive Feature: 24-Hour Day Itinerary Planner */}
      <section className="bg-stone-950 text-white rounded-3xl p-6 md:p-8 border border-stone-800 shadow-xl space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-widest text-teal-400 uppercase"><Translate>Interactive Lab</Translate></span>
            <h2 className="text-xl md:text-2xl font-display font-bold text-white tracking-tight flex items-center gap-2">
              <Compass className="w-5 h-5 text-teal-400" />
              <Translate>Day-Trip Custom Itinerary Planner</Translate>
            </h2>
            <p className="text-xs text-stone-400"><Translate>Generate a custom 24-hour visual itinerary based on your travel personality.</Translate></p>
          </div>

          {/* Style Selector */}
          <div className="flex bg-stone-900 border border-stone-800 p-1 rounded-xl">
            {[
              { id: "heritage", label: "Heritage Walk" },
              { id: "modern", label: "Future Tech" },
              { id: "gourmet", label: "Culinary" },
            ].map((style) => (
              <button
                key={style.id}
                onClick={() => setItineraryStyle(style.id as any)}
                className={`px-3.5 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                  itineraryStyle === style.id
                    ? "bg-teal-500 text-stone-950 font-bold shadow-xs"
                    : "text-stone-400 hover:text-white"
                }`}
              >
                <Translate>{style.label}</Translate>
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
    </div>
  );
}

function cityKoreanName(id: string): string {
  switch (id) {
    case "seoul": return "서울";
    case "jeju": return "제주도";
    case "gyeongju": return "경주";
    case "busan": return "부산";
    default: return "";
  }
}
