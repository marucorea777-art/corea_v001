import guryeSansuyuImg from "./assets/images/gurye_sansuyu_real.jpg";
import hampyeongButterflyImg from "./assets/images/hampyeong_butterfly_real.jpg";
import jejuFireImg from "./assets/images/jeju_fire_real.jpg";
import buyeoLotusImg from "./assets/images/buyeo_lotus_real.jpg";
import mujuFireflyImg from "./assets/images/muju_firefly_real.jpg";
import bonghwaSweetfishImg from "./assets/images/bonghwa_sweetfish_real.jpg";
import suncheonReedsImg from "./assets/images/suncheon_reeds_real.jpg";
import pyeongchangTroutImg from "./assets/images/pyeongchang_trout_real.jpg";
import cheongyangIceFountainImg from "./assets/images/cheongyang_ice_real.jpg";

import { Palace, HeritageItem, TimelineItem, CultureCategory, CultureItem, Destination, Festival, HangulConcept, CardStyle } from "./types";

import jinhaeImg from "./assets/images/jinhae_cherry_blossoms_1784195690902.jpg";
import boryeongImg from "./assets/images/boryeong_mud_festival_1784195709023.jpg";
import andongImg from "./assets/images/andong_mask_dance_1784195721767.jpg";
import seoulLanternImg from "./assets/images/seoul_lantern_festival_1784195734574.jpg";
import gyeongjuImg from "./assets/images/gyeongju_historic_1784195747094.jpg";

import gyeongbokgungImg from "./assets/images/gyeongbokgung_1784268523608.jpg";
import changdeokgungImg from "./assets/images/changdeokgung_1784268539166.jpg";
import deoksugungImg from "./assets/images/deoksugung_1784268554232.jpg";
import gyeongjuTombsImg from "./assets/images/gyeongju_tombs_1784268566352.jpg";
import changgyeonggungImg from "./assets/images/changgyeonggung_palace_traditional_1784350586623.jpg";
import gyeonghuigungImg from "./assets/images/gyeonghuigung_1784268594225.jpg";
import moonJarImg from "./assets/images/joseon_moon_jar_1784268608932.jpg";
import goldCrownImg from "./assets/images/silla_gold_crown_1784268621898.jpg";
import hunminjeongeumImg from "./assets/images/hunminjeongeum_1784268637252.jpg";
import bulguksaImg from "./assets/images/bulguksa_temple_1784268649821.jpg";
import celadonImg from "./assets/images/goryeo_celadon_1784268663910.jpg";
import joseonDeskImg from "./assets/images/joseon_desk_1784268676501.jpg";
import baekjeBurnerImg from "./assets/images/baekje_burner_1784268689049.jpg";
import hansikFeastImg from "./assets/images/hansik_feast_1784268705189.jpg";
import hanbokCourtImg from "./assets/images/hanbok_court_1784268718628.jpg";
import kpopConcertImg from "./assets/images/kpop_concert_1784268731880.jpg";
import songdoSmartImg from "./assets/images/songdo_smart_1784268745135.jpg";
import bibimbapImg from "./assets/images/dolsot_bibimbap_1784268765392.jpg";
import bukchonVillageImg from "./assets/images/bukchon_village_1784268778328.jpg";
import jejuCliffsImg from "./assets/images/jeju_cliffs_1784268795444.jpg";
import seongsanCraterImg from "./assets/images/seongsan_crater_1784268809523.jpg";
import jejuHaenyeoImg from "./assets/images/jeju_haenyeo_1784268830045.jpg";
import cheomseongdaeImg from "./assets/images/cheomseongdae_1784268848706.jpg";
import haedongTempleImg from "./assets/images/haedong_temple_1784268861045.jpg";
import kimchiImg from "./assets/images/korean_kimchi_1784268891534.jpg";

import boseongTeaImg from "./assets/images/boseong_tea_fields_1784464230771.jpg";
import gimjeHorizonImg from "./assets/images/gimje_horizon_fields_1784464246685.jpg";
import hwacheonIceImg from "./assets/images/hwacheon_ice_festival_1784464259731.jpg";
import jinjuYudeungImg from "./assets/images/jinju_yudeung_festival_1784534700060.jpg";

import dokdoImg from "./assets/images/dokdo_island_1784535373109.jpg";
import seoulNamsanImg from "./assets/images/seoul_gwanghwamun_namsan_1784535390576.jpg";
import busanGwanganImg from "./assets/images/busan_gwangan_bridge_1784535406015.jpg";

import bulgogiImg from "./assets/images/bulgogi_dish_1784538243094.jpg";
import gejangImg from "./assets/images/ganjang_gejang_dish_1784538254621.jpg";

import tteokbokkiImg from "./assets/images/tteokbokki_dish_1784538267364.jpg";

export const PALACES: Palace[] = [
  {
    id: "gyeongbokgung",
    name: "Gyeongbokgung",
    koreanName: "경복궁",
    founded: "1395",
    description: "The primary and grandest royal palace of the Joseon Dynasty. Located in northern Seoul, its majestic throne hall, Geunjeongjeon, and the floating pavilion, Gyeonghoeru, standing over a serene lotus pond, epitomize traditional Korean royal architecture.",
    keyHighlight: "The Royal Guard Changing Ceremony & Gyeonghoeru Pavilion",
    image: gyeongbokgungImg,
    location: "Sajik-ro, Jongno-gu, Seoul",
    detailedTips: "Rent a Hanbok (traditional Korean dress) nearby to gain free admission! Visit in the morning to catch the guard ceremony at 10:00 AM or 2:00 PM."
  },
  {
    id: "changdeokgung",
    name: "Changdeokgung",
    koreanName: "창덕궁",
    founded: "1405",
    description: "Renowned as a UNESCO World Heritage site, this palace was favored by many Joseon kings because it blends seamlessly with the surrounding natural topography instead of imposing upon it.",
    keyHighlight: "The Secret Garden (Huwon) - A masterpiece of nature harmony",
    image: changdeokgungImg,
    location: "Yulgok-ro, Jongno-gu, Seoul",
    detailedTips: "The Secret Garden requires a separate, guided-only ticket which sells out quickly. Reserve online weeks in advance to secure your spot."
  },
  {
    id: "deoksugung",
    name: "Deoksugung",
    koreanName: "덕수궁",
    founded: "15th Century",
    description: "Unique among Seoul's palaces, Deoksugung is famous for its eclectic architectural elements, incorporating neoclassical Western-style stone buildings alongside traditional Korean wooden structures.",
    keyHighlight: "Seokjojeon (Western Stone Hall) & beautiful stonewall walkways",
    image: deoksugungImg,
    location: "Sejong-daero, Jung-gu, Seoul",
    detailedTips: "Stroll down the Deoksugung Stonewall Path (Doldam-gil) during autumn when the ginkgo leaves turn brilliant golden yellow. It's open until 9:00 PM for stunning night views."
  },
  {
    id: "changgyeonggung",
    name: "Changgyeonggung",
    koreanName: "창경궁",
    founded: "1483",
    description: "Originally built by King Seongjong of the Joseon Dynasty as a residence for queens and dowagers, Changgyeonggung features elegant, authentic Korean wooden halls like Myeongjeongjeon (the oldest remaining main hall among Seoul's palaces) and is celebrated for its harmonious blending of stone, water, and ancient pine trees.",
    keyHighlight: "Myeongjeongjeon Hall & the serene Chundangji Pond",
    image: changgyeonggungImg,
    location: "Changgyeonggung-ro, Jongno-gu, Seoul",
    detailedTips: "Excellent for escaping crowds and enjoying quiet contemplation. The traditional wooden eaves look majestic against seasonal trees, and the evening lit-up paths around Chundangji Pond offer an unforgettable experience of peace."
  },
  {
    id: "gyeonghuigung",
    name: "Gyeonghuigung",
    koreanName: "경희궁",
    founded: "1623",
    description: "Known as the Western Palace of the secondary royal residences, it served as a shelter during emergencies. It is nestled quietly beside the Seoul Museum of History and offers a peaceful sanctuary of raw traditional lines.",
    keyHighlight: "Sungjeongjeon (Throne Chamber) nestled in lush greenery",
    image: gyeonghuigungImg,
    location: "Saemunan-ro, Jongno-gu, Seoul",
    detailedTips: "Admission is completely free. Its quiet, uncrowded courtyard makes it perfect for photography of classic wooden eaves and stone steps."
  }
];

export const HERITAGE_ITEMS: HeritageItem[] = [
  {
    id: "moon-jar",
    name: "The Joseon Moon Jar",
    category: "Artifact",
    description: "A monumental, spherical white porcelain jar crafted during the mid-to-late Joseon Dynasty. Rather than showing flawless geometry, the Moon Jar is formed by joining two separate wheel-thrown halves, resulting in a gentle, organic, and beautifully asymmetrical shape resembling a full moon.",
    image: moonJarImg,
    period: "Joseon Dynasty (17th - 18th Century)",
    keyHighlight: "Beauty of Imperfection & Minimalist Aesthetics"
  },
  {
    id: "golden-crowns",
    name: "Silla Golden Crown",
    category: "Artifact",
    description: "Discovered in the massive tumuli tombs of Gyeongju, these breathtaking crowns are made of pure sheet gold, adorned with complex jade comma-shaped beads (gogok) and tiny golden spangles. They symbolize the sacred cosmic tree connecting heaven and earth.",
    image: goldCrownImg,
    period: "Silla Kingdom (5th - 6th Century)",
    keyHighlight: "Masterful Goldsmithing & Sacred Shamanic Tree Symbolism"
  },
  {
    id: "bulguksa",
    name: "Bulguksa Temple",
    category: "Architecture",
    description: "A crowning architectural masterpiece of the Golden Age of Buddhist art in the Silla Kingdom. It features stone terraces, staircases of exquisite stone masonry, and twin pagodas, Seokgatap and Dabotap, which stand as towering emblems of classical symmetry and Buddhist cosmological ideals.",
    image: bulguksaImg,
    period: "Unified Silla (Founded 751 AD)",
    keyHighlight: "The stone bridges of Cheongungyo and Baekungyo, and Dabotap Pagoda"
  },
  {
    id: "hangeul-script",
    name: "Hunminjeongeum",
    category: "Living Heritage",
    description: "The original document describing 'Hangeul'—the native phonetic script of Korea, commissioned by King Sejong the Great in 1443. Designed to be easily learned by the common people, its elegant alphabetic letters mimic the vocal organs during speech, representing one of the most scientific scripts in human history.",
    image: hunminjeongeumImg,
    period: "Joseon Dynasty (1443 AD)",
    keyHighlight: "The scientific vowel-consonant phonetic structures & democratic literacy"
  },
  {
    id: "dokdo-island",
    name: "Dokdo Island",
    category: "Natural Heritage",
    description: "A breathtaking volcanic island cluster situated in the East Sea of South Korea, designated as Natural Monument No. 336. Formed millions of years ago by deep-ocean volcanic eruptions, it features dramatic vertical basalt cliffs and pristine, rich marine ecosystems. Recorded historically as Korean territory since the Silla Dynasty (512 AD) when General Isabu integrated the island kingdom of Usan-guk, Dokdo remains a beloved, eternal symbol of Korea's beautiful geography and sovereign pride.",
    image: dokdoImg,
    period: "Silla Kingdom (512 AD) – Present",
    keyHighlight: "Volcanic Basalt Cliffs & Sovereign National Natural Monument"
  }
];

export const TIMELINE: TimelineItem[] = [
  {
    id: "three-kingdoms",
    title: "Three Kingdoms Period",
    period: "57 BC - 668 AD",
    summary: "The heroic era of Goguryeo, Baekje, and Silla ruling the peninsula.",
    details: "This era was defined by powerful military expansion, the introduction of Buddhism, and vibrant artistic exchanges. Goguryeo guarded the north with monumental tombs, Baekje excelled in refined Buddhist crafts, and Silla pioneered gold art.",
    image: baekjeBurnerImg
  },
  {
    id: "unified-silla",
    title: "Unified Silla & Balhae",
    period: "668 - 935 AD",
    summary: "A golden age of classical Buddhist art, architecture, and philosophical synthesis.",
    details: "Centering around the capital city of Seorabeol (modern Gyeongju), this era witnessed the construction of Bulguksa Temple and Seokguram Grotto, alongside massive trade links connecting Korea to the Silk Road.",
    image: gyeongjuImg
  },
  {
    id: "goryeo-dynasty",
    title: "Goryeo Dynasty",
    period: "918 - 1392 AD",
    summary: "The era that gave 'Korea' its global name. Renowned for celadon and metal print.",
    details: "Goryeo consolidated peninsular power, developed the famous jade-green Goryeo Celadon (Goryeo Cheongja), and created the Tripitaka Koreana—over 81,000 wooden blocks of Buddhist scriptures—and the world's first metal movable type (Jikji).",
    image: celadonImg
  },
  {
    id: "joseon-dynasty",
    title: "Joseon Dynasty",
    period: "1392 - 1910 AD",
    summary: "A Neo-Confucian empire that shaped modern Korean language, morals, and customs.",
    details: "Founded by King Taejo, Joseon established Hanyang (Seoul) as capital, commissioned Hangeul under King Sejong, built the Five Grand Palaces, and fostered an elite class of scholar-bureaucrats (Yangban) emphasizing calligraphy, poetry, and ceramics.",
    image: joseonDeskImg
  }
];

export const CULTURE_CATEGORIES: CultureCategory[] = [
  {
    id: "gastronomy",
    title: "Gastronomy (Hansik)",
    subtitle: "Harmony, Fermentation, and Seasonal Abundance",
    coverImage: hansikFeastImg,
    intro: "Korean cuisine, or Hansik, is founded on the philosophy of balance—combining five colors (obangsaek) representing nature's elements, and utilizing patient fermentation techniques to extract deep, gut-healthy umami flavors."
  },
  {
    id: "arts",
    title: "Traditional Arts & Crafts",
    subtitle: "Elegance of Line, Flow, and Living Materials",
    coverImage: hanbokCourtImg,
    intro: "From the soft folds of Hanbok silk to the delicate earthiness of Onggi earthenware, Korean traditional art celebrates the inherent grace of natural materials left unspoiled."
  },
  {
    id: "global",
    title: "Global K-Wave",
    subtitle: "Vibrant Beats, Narrative Cinema, and Global Connection",
    coverImage: kpopConcertImg,
    intro: "The rise of Hallyu (Korean Wave) has transformed South Korea into a primary exporter of global pop culture, blending hyper-synchronized performances, cinema, and digital narratives."
  },
  {
    id: "innovation",
    title: "Modern Innovation",
    subtitle: "High-Tech Smart Cities and Robotic Futures",
    coverImage: songdoSmartImg,
    intro: "Korea seamlessly pairs ancient heritage with hyper-modernity, leading global networks in semiconductor design, AI-driven public services, and cutting-edge ecological architecture."
  }
];

export const CULTURE_ITEMS: CultureItem[] = [
  {
    id: "kimchi",
    categoryId: "gastronomy",
    title: "Kimchi & Jang",
    koreanName: "김치와 장",
    summary: "The heart and soul of Korean seasoning through lacto-fermentation.",
    details: "Kimchi (fermented seasoned cabbage) and traditional condiments like Doenjang (soybean paste) and Gochujang (chili paste) are cured in traditional clay pots (Onggi) to allow microscopic breathing. They provide a nutrient-dense foundation for almost every Korean meal.",
    image: kimchiImg,
    highlights: ["Onggi pottery-cured", "Probiotic fermentation", "The backbone of Korean dining table"],
    tips: "For the most authentic flavors, try aged kimchi (Mukeunji) cooked slowly into pork belly stews."
  },
  {
    id: "bibimbap",
    categoryId: "gastronomy",
    title: "Bibimbap",
    koreanName: "비빔밥",
    summary: "A colorful, visual bowl symbolizing cosmic harmony on a plate.",
    details: "Bibimbap literally translates to 'mixed rice.' A hot stone bowl (Dolsot) is loaded with rice, sesame oil, and colorful sauteed vegetables arranged to symbolize the five primary elements (Obangsaek), topped with a fresh egg yolk and spicy Gochujang sauce.",
    image: bibimbapImg,
    highlights: ["Stone bowl serving", " Obangsaek (Five elements)", "Custom-mixed heat"],
    tips: "Let the rice sit untouched in the hot stone bowl for a few minutes at the start to develop a crispy, delicious layer at the bottom called Nurungji."
  },
  {
    id: "bulgogi",
    categoryId: "gastronomy",
    title: "Bulgogi",
    koreanName: "불고기",
    summary: "Sizzling, tender, sweet-and-savory marinated grilled beef.",
    details: "Bulgogi, meaning 'fire meat,' is one of Korea's most popular beef dishes. Thin slices of ribeye or sirloin are marinated in a blend of soy sauce, pear juice, sesame oil, garlic, and scallions to tenderize and sweeten, then grilled over open flames or caramelized on hot plates.",
    image: bulgogiImg,
    highlights: ["Fire-grilled marinade", "Pear-juice tenderized", "Sweet & savory profile"],
    tips: "Wrap a hot piece of bulgogi inside a fresh lettuce leaf (sangchu) with a dab of ssamjang paste for a perfect traditional Korean wrap (ssam)."
  },
  {
    id: "ganjang-gejang",
    categoryId: "gastronomy",
    title: "Ganjang Gejang",
    koreanName: "간장게장",
    summary: "Exquisite raw crabs marinated in cured herb-soy sauce, known as a 'rice thief.'",
    details: "Ganjang Gejang is a legendary gourmet delicacy. Fresh raw crabs are fermented in a chilled boiled soy sauce infused with ginger, garlic, herbs, and chilies. The deep, rich umami roe and delicate sweet meat make it so delicious that Koreans call it 'Bapdojeok' (rice thief) because the bowl of rice vanishes instantly.",
    image: gejangImg,
    highlights: ["Umami-rich crab roe", "Patient soy-herb fermentation", "The ultimate 'Rice Thief'"],
    tips: "Mix your warm white rice directly into the empty main crab shell (Ge-ttakji) with a tiny drop of sesame oil to capture every bit of rich, savory roe."
  },
  {
    id: "tteokbokki",
    categoryId: "gastronomy",
    title: "Tteokbokki",
    koreanName: "떡볶이",
    summary: "Chewy cylinder rice cakes bathed in glossy, sweet and spicy chili sauce.",
    details: "Tteokbokki is Korea's ultimate street food masterpiece. Soft, cylindrical rice cakes (garae-tteok) and flat fish cakes are simmered in a dense, fiery-red broth made of Gochujang, Gochugaru, and sweet syrup, creating a wonderful chewy texture and highly addictive flavor profile.",
    image: tteokbokkiImg,
    highlights: ["Chewy rice cake texture", "Addictive sweet-spicy kick", "Beloved street market food"],
    tips: "Dunk crisp fried seaweed rolls (gimmari) or flat dumplings directly into the thick, glowing red tteokbokki sauce for an authentic market combo."
  },
  {
    id: "hanbok",
    categoryId: "arts",
    title: "The Hanbok",
    koreanName: "한복",
    summary: "Traditional clothing characterized by vibrant colors and simple, flowing lines.",
    details: "Hanbok features a elegant structure—a short jacket (Jeogori) and a full, wrap-around high-waisted skirt (Chima) for women. The silhouette is designed to create volume and majestic, sweeping wind movements, rather than cling tightly to the body.",
    image: hanbokCourtImg,
    highlights: ["Symmetry of curved lines", "Obangsaek natural dyes", "Elegant high waistlines"],
    tips: "Modern Hanbok variations (Saenghwal Hanbok) blend these traditional lines with modern fabrics for casual, daily street wear."
  },
  {
    id: "pottery",
    categoryId: "arts",
    title: "Buncheong & Celadon",
    koreanName: "분청과 청자",
    summary: "Exquisite clay artistry representing royal luxury and rustic warmth.",
    details: "While Goryeo Celadon achieved legendary status for its mysterious blue-green glaze resembling mountain streams, Joseon Buncheong ware focused on bold, spontaneous white slip brushstrokes and iron-etched fish motifs, popular among contemporary modern art collectors.",
    image: celadonImg,
    highlights: ["Goryeo jade-green glaze", "Joseon slip brush strokes", "Asymmetric handcrafting"],
    tips: "Visit the pottery village of Icheon just outside Seoul to watch master potters fire these ancient kilns."
  },
  {
    id: "kpop-phenomenon",
    categoryId: "global",
    title: "K-Pop & Dance",
    koreanName: "케이팝",
    summary: "A global musical force blending high production values and choreography.",
    details: "Far beyond simple music, K-Pop combines addictive hooks, intricate storytelling, cinematic music videos, and flawless synchronization of choreography. It is driven by global fanbases that break boundary lines to unite in virtual space.",
    image: kpopConcertImg,
    highlights: ["Hyper-synchronous dancing", "Cinematic worldview lore", "Global fan-community activism"],
    tips: "Experience a live recording of music programs or visit a specialized K-Pop dance workshop in Hongdae to learn the latest choreography."
  },
  {
    id: "korean-cinema",
    categoryId: "global",
    title: "K-Cinema & Drama",
    koreanName: "K-무비와 드라마",
    summary: "Compelling narratives that tackle profound societal and human themes.",
    details: "With historic milestones like the Oscar-winning 'Parasite' and global streaming giants like 'Squid Game', Korean cinema has earned praise for its boundary-pushing genre blends, dark humor, and high-stakes social commentaries.",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop",
    highlights: ["Genre-bending plots", "Raw social realism", "Spectacular cinematography"],
    tips: "Check out the annual Busan International Film Festival (BIFF) in October to catch world premieres."
  },
  {
    id: "smart-cities",
    categoryId: "innovation",
    title: "Hyper-Connected Songdo",
    koreanName: "송도 스마트시티",
    summary: "A sustainable city built from scratch on reclaimed land.",
    details: "Songdo stands as a global blueprint for futuristic urban planning, where pneumatic garbage chutes suck waste directly from homes to recycling centers, and extensive sensor arrays monitor water, electricity, and traffic flow in real-time.",
    image: songdoSmartImg,
    highlights: ["Pneumatic waste tubes", "70% less energy footprint", "Uptrend of green space"],
    tips: "Rent a water taxi or bike in Songdo Central Park, modeled after New York's park but lined with ultra-futuristic skyscrapers."
  },
  {
    id: "k-robotics",
    categoryId: "innovation",
    title: "Advanced Robotics & AI",
    koreanName: "로보틱스 테크",
    summary: "Pioneering service robots, humanoid design, and autonomous AI.",
    details: "South Korea boasts the world's highest industrial robot density. Today, AI-powered barista robots, hospitality assistants, and humanoid robots like HUBO walk hospital corridors and coffee shops, demonstrating a harmonious co-existence of humans and machines.",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800&auto=format&fit=crop",
    highlights: ["Humanoid rescue robots", "Automated transit & safety", "Seamless consumer integration"],
    tips: "Check out AI cafés in Seoul's Gangnam district where robotic arms brew pour-overs with scientific precision."
  }
];

export const DESTINATIONS: Destination[] = [
  {
    id: "seoul",
    name: "Seoul",
    koreanName: "서울",
    tagline: "The Neon-Lit Capital of Ancient Spirit and High Tech",
    description: "A sprawling metropolis where 600-year-old palaces sit surrounded by towering glass skyscrapers. Seoul is a 24-hour city where tranquil mountain hikes, traditional markets, design centers, and dynamic nightlife districts exist side-by-side.",
    coverImage: seoulNamsanImg,
    locationLabel: "37.5665° N, 126.9780° E",
    highlights: ["Dongdaemun Design Plaza", "Bukchon Hanok Village", "Myeongdong Street Food", "Namsan Seoul Tower"],
    travelTips: {
      bestTime: "April (Cherry Blossoms) or October (Autumn Foliage)",
      mustTry: "Chimaek (Fried chicken and draft beer) alongside the Han River at night",
      hiddenGem: "Iwha Mural Village - A hillside village with artistic stairs and quiet cafes"
    },
    attractions: [
      {
        name: "Bukchon Hanok Village",
        desc: "A charming neighborhood home to hundreds of traditional Hanok wooden houses, preserving the authentic historic urban environment of Seoul.",
        image: bukchonVillageImg
      },
      {
        name: "Dongdaemun Design Plaza (DDP)",
        desc: "Designed by Zaha Hadid, this neofuturistic building with curving silver plates is the absolute epic epicenter of Seoul design, fashion, and technology.",
        image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=800&auto=format&fit=crop"
      }
    ]
  },
  {
    id: "jeju",
    name: "Jeju Island",
    koreanName: "제주도",
    tagline: "Volcanic Wonders, Haenyeo Divers, and Emerald Waters",
    description: "Korea's island paradise, dominated by Hallasan, an extinct volcano. Renowned for its unique black basalt stones, scenic ocean cliffs, pristine beaches, and the legendary Haenyeo (female breath-hold divers) who harvest fresh seafood from the cold deeps.",
    coverImage: jejuCliffsImg,
    locationLabel: "33.4996° N, 126.5312° E",
    highlights: ["Seongsan Ilchulbong Tuff Cone", "Hallasan Volcanic National Park", "Manjanggul Lava Tube", "Haenyeo Divers Show"],
    travelTips: {
      bestTime: "Late Spring (Canola blossoms) or Early Autumn",
      mustTry: "Jeju Black Pork barbecue and sweet, freshly picked Hallabong citrus oranges",
      hiddenGem: "Bijarim Forest - A therapeutic walk among 800-year-old nutmeg trees"
    },
    attractions: [
      {
        name: "Seongsan Ilchulbong",
        desc: "A majestic, crown-like volcanic tuff cone rising directly out of the ocean, offering legendary views of the sunrise.",
        image: seongsanCraterImg
      },
      {
        name: "The Haenyeo Culture",
        desc: "UNESCO-recognized female divers who submerge up to 10 meters deep without oxygen masks, harvesting abalone and conch.",
        image: jejuHaenyeoImg
      }
    ]
  },
  {
    id: "gyeongju",
    name: "Gyeongju",
    koreanName: "경주",
    tagline: "The Museum Without Walls and Capital of Golden Kings",
    description: "The ancient capital of the Silla Kingdom for nearly 1,000 years. Gyeongju is packed with massive grass-covered royal tomb mounds, ancient temples, ruins, and the world's oldest surviving astronomical observatory, Cheomseongdae.",
    coverImage: gyeongjuTombsImg,
    locationLabel: "35.8562° N, 129.2132° E",
    highlights: ["Anapji (Donggung) Pond at night", "Daereungwon Royal Tomb Park", "Cheomseongdae Observatory", "Seokguram Grotto"],
    travelTips: {
      bestTime: "Mid-October (Ginkgo trees and pink muhly grass fields)",
      mustTry: "Gyeongju Hwangnam Bread, a sweet, warm pastry packed with sweet red bean paste",
      hiddenGem: "Hwangnidang-gil - A street of traditional Hanoks converted into trendy modern cafes and shops"
    },
    attractions: [
      {
        name: "Donggung Palace & Wolji Pond",
        desc: "An ancient royal garden reflecting pool that glows spectacularly at night, reflecting gold-lit traditional pavilions.",
        image: gyeongjuImg
      },
      {
        name: "Cheomseongdae Observatory",
        desc: "Built in the 7th century under Queen Seondeok, this elegant stone tower represents the oldest astronomical observatory in East Asia.",
        image: cheomseongdaeImg
      }
    ]
  },
  {
    id: "busan",
    name: "Busan",
    koreanName: "부산",
    tagline: "Dynamic Maritime Hub, Coastal Temples, and Sandy Shores",
    description: "Korea's largest port city, famous for its energetic coastal atmosphere, sandy beaches, colorful mountainside arts villages, seafood markets, and scenic suspension bridges glowing over the sea.",
    coverImage: busanGwanganImg,
    locationLabel: "35.1796° N, 129.0756° E",
    highlights: ["Haeundae Beach & Sky Capsule", "Gamcheon Culture Village", "Jagalchi Fish Market", "Haedong Yonggungsa Temple"],
    travelTips: {
      bestTime: "June to August (Beach season) or October (Busan Film Festival)",
      mustTry: "Dwaeji Gukbap (Rich pork broth soup with rice) and warm ssiat hotteok pancakes",
      hiddenGem: "Cheongsapo Daritdol Skywalk - A glass bridge protruding over roaring ocean waves"
    },
    attractions: [
      {
        name: "Gamcheon Culture Village",
        desc: "A colorful, terraced hillside neighborhood nicknamed the 'Machu Picchu of Busan', packed with art installations and alleys.",
        image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?q=80&w=800&auto=format&fit=crop"
      },
      {
        name: "Haedong Yonggungsa Temple",
        desc: "One of Korea's rare Buddhist temples built directly onto a rugged, wave-battered rocky coast, offering spiritual ocean views.",
        image: haedongTempleImg
      }
    ]
  }
];

export const FESTIVALS: Festival[] = [
  {
    id: "jinhae",
    name: "Jinhae Cherry Blossom Festival",
    koreanName: "진해군항제",
    season: "Spring",
    region: "Gyeongsang",
    category: "Flower & Nature",
    location: "Jinhae-gu, Changwon-si, Gyeongsangnam-do",
    dateRange: "Late March – Early April",
    description: "Korea's largest spring festival, attracting millions of visitors who walk under tunnels of over 360,000 blooming cherry blossom trees. The Yeojwacheon Stream and Gyeonghwa Station railway are famous photo spots.",
    image: jinhaeImg,
    highlight: "Walking across the Romance Bridge over the flower-scattered stream",
    features: ["Yeojwacheon Light Show", "Military Band Parade", "Cherry blossom food stalls"],
    month: 4
  },
  {
    id: "yeouido-flower",
    name: "Yeouido Spring Flower Festival",
    koreanName: "여의도 봄꽃축제",
    season: "Spring",
    region: "Seoul/Capital",
    category: "Flower & Nature",
    location: "Yeouido Yunjung-ro, Yeongdeungpo-gu, Seoul",
    dateRange: "Early April",
    description: "Seoul's signature cherry blossom festival where over 1,800 King Cherry trees line the Han River along Yeouido Island. Features street performances, food trucks, and night-time lighting.",
    image: "https://images.unsplash.com/photo-1522383225653-ed111181a951?q=80&w=1200&auto=format&fit=crop",
    highlight: "Strolling under night-lit cherry blossom tunnels along the Han River",
    features: ["Han River night walks", "Acoustic busking shows", "Seasonal food trucks"],
    month: 4
  },
  {
    id: "gurye-sansuyu",
    name: "Gurye Sansuyu Festival",
    koreanName: "구례 산수유꽃축제",
    season: "Spring",
    region: "Jeolla",
    category: "Flower & Nature",
    location: "Sandong-myeon, Gurye-gun, Jeollanam-do",
    dateRange: "Mid-to-Late March",
    description: "Nestled at the foot of Jirisan Mountain, this scenic local festival signals spring with vibrant yellow Cornelian cherry (Sansuyu) blossoms painting ancient stone-wall villages.",
    image: guryeSansuyuImg,
    highlight: "Golden yellow blossoms against Jirisan's snowy mountain backdrop",
    features: ["Sansuyu tea tasting", "Village stone wall trail", "Local herbal market"],
    month: 3
  },
  {
    id: "taean-tulip",
    name: "Taean World Tulip Festival",
    koreanName: "태안 세계튤립꽃축제",
    season: "Spring",
    region: "Chungcheong",
    category: "Flower & Nature",
    location: "Kkotji Beach, Taean-gun, Chungcheongnam-do",
    dateRange: "Mid-April – Early May",
    description: "Ranked among the world's top 5 tulip festivals, Taean displays over 2 million vibrant tulips of 200 species planted in intricate artistic patterns right by the Yellow Sea.",
    image: "https://images.unsplash.com/photo-1520763185298-1b434c919102?q=80&w=1200&auto=format&fit=crop",
    highlight: "Breathtaking tulip flower carpets overlooking the ocean sunset",
    features: ["Night LED lighting show", "Oceanfront flower maze", "Local seafood market"],
    month: 4
  },
  {
    id: "nonsan-strawberry",
    name: "Nonsan Strawberry Festival",
    koreanName: "논산 딸기축제",
    season: "Spring",
    region: "Chungcheong",
    category: "Food & Gourmet",
    location: "Nonsan Stream Park, Nonsan-si, Chungcheongnam-do",
    dateRange: "Late March",
    description: "A delicious regional harvest celebration in Korea's premier strawberry farming county. Visitors pick sweet fresh strawberries, bake strawberry desserts, and enjoy family games.",
    image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?q=80&w=1200&auto=format&fit=crop",
    highlight: "Unlimited fresh sweet strawberry picking directly in greenhouse farms",
    features: ["Strawberry cake baking", "Harvesting hands-on program", "Strawberry jam making"],
    month: 3
  },
  {
    id: "hampyeong-butterfly",
    name: "Hampyeong Butterfly Festival",
    koreanName: "함평 나비대축제",
    season: "Spring",
    region: "Jeolla",
    category: "Flower & Nature",
    location: "Hampyeong Expo Park, Jeollanam-do",
    dateRange: "Late April – Early May",
    description: "An eco-friendly spring festival releasing hundreds of thousands of live butterflies over vast fields of rape flowers and milk vetch, providing hands-on nature discovery.",
    image: hampyeongButterflyImg,
    highlight: "Releasing thousands of colorful live butterflies into the open spring sky",
    features: ["Butterfly pavilion", "Caterpillar observation dome", "Eco-craft workshops"],
    month: 5
  },
  {
    id: "boseong-tea",
    name: "Boseong Green Tea Festival",
    koreanName: "보성다향대축제",
    season: "Spring",
    region: "Jeolla",
    category: "Food & Gourmet",
    location: "Daehan Dawon Tea Plantation, Boseong, Jeollanam-do",
    dateRange: "Early May",
    description: "Set in the breathtaking, terraced green tea plantations of Boseong, this spring festival allows visitors to fully immerse themselves in green tea culture—from picking fresh leaves to making and tasting premium green tea.",
    image: boseongTeaImg,
    highlight: "Walking through the emerald terraced green tea hills in morning mist",
    features: ["Fresh green tea leaf picking", "Traditional tea ceremony workshop", "Green tea food court"],
    month: 5
  },
  {
    id: "jeju-fire",
    name: "Jeju Fire Festival",
    koreanName: "제주들불축제",
    season: "Spring",
    region: "Jeju",
    category: "Traditional & Culture",
    location: "Saebyeol Oreum, Jeju Island",
    dateRange: "Early March",
    description: "A spectacular and grand fire festival where an entire volcanic hill (Saebyeol Oreum) is set ablaze to pray for health, good harvest, and happiness in the new year.",
    image: jejuFireImg,
    highlight: "Setting the entire majestic Saebyeol Oreum hill on fire under fireworks",
    features: ["Oreum lighting ceremony", "Traditional torch march", "Jeju folklore performances"],
    month: 3
  },
  {
    id: "boryeong",
    name: "Boryeong Mud Festival",
    koreanName: "보령머드축제",
    season: "Summer",
    region: "Chungcheong",
    category: "Music & Arts",
    location: "Daecheon Beach, Boryeong, Chungcheongnam-do",
    dateRange: "Mid-to-Late July",
    description: "An energetic, wild summer party where locals and tourists slather themselves in mineral-rich mud known for its cosmetic properties. Expect giant mud slides, mud wrestling, beach concerts, and firework shows.",
    image: boryeongImg,
    highlight: "Mega mud slides and sunset live electronic concerts on the sand",
    features: ["Mud obstacle course", "Mud skin therapy", "Ocean firework festival"],
    month: 7
  },
  {
    id: "gangneung-danoje",
    name: "Gangneung Danoje Festival",
    koreanName: "강릉단오제",
    season: "Summer",
    region: "Gangwon",
    category: "Traditional & Culture",
    location: "Namdaecheon Stream, Gangneung-si, Gangwon-do",
    dateRange: "May – June (5th day of 5th lunar month)",
    description: "Designated as a UNESCO Intangible Cultural Heritage, this ancient Korean festival preserves centuries-old shamanic rituals, Gwanno masked dance dramas, and traditional wrestling (Ssireum).",
    image: hanbokCourtImg,
    highlight: "Authentic UNESCO shamanic rituals and Gwanno silent masked drama",
    features: ["Shamanic music & rituals", "Traditional Ssireum wrestling", "Surisunchae herb tasting"],
    month: 6
  },
  {
    id: "daegu-chimaek",
    name: "Daegu Chimaek Festival",
    koreanName: "대구 치맥페스티벌",
    season: "Summer",
    region: "Gyeongsang",
    category: "Food & Gourmet",
    location: "Duryu Park, Daegu",
    dateRange: "Early July",
    description: "Celebrating Korea's iconic combo of Fried Chicken (Chi) and Ice-cold Beer (Maek). Features hundred brands of crispy chicken, live EDM stages, ice water pools, and summer night concerts.",
    image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?q=80&w=1200&auto=format&fit=crop",
    highlight: "Savoring piping-hot Korean fried chicken with ice-cold craft beers under summer stars",
    features: ["Chicken brand tasting zones", "EDM & K-Pop stage", "Ice foot bath lounges"],
    month: 7
  },
  {
    id: "buyeo-lotus",
    name: "Buyeo Seodong Lotus Festival",
    koreanName: "부여 서동연꽃축제",
    season: "Summer",
    region: "Chungcheong",
    category: "Flower & Nature",
    location: "Gungnamji Pond, Buyeo-gun, Chungcheongnam-do",
    dateRange: "Mid-July",
    description: "Held at Gungnamji, Korea's first artificial royal pond built during the Baekje Kingdom. Over 50 varieties of pink and white lotus flowers bloom over a serene ancient royal garden.",
    image: buyeoLotusImg,
    highlight: "Nightly canoe rides amidst thousands of blooming pink lotus flowers",
    features: ["Lotus leaf tea tasting", "Baekje night illumination", "Lotus flower boat ride"],
    month: 7
  },
  {
    id: "muju-firefly",
    name: "Muju Firefly Festival",
    koreanName: "무주 반딧불축제",
    season: "Summer",
    region: "Jeolla",
    category: "Flower & Nature",
    location: "Namdaecheon Stream, Muju-gun, Jeollabuk-do",
    dateRange: "Late August – Early September",
    description: "A serene eco-festival celebrating the pristine environment of Muju where thousands of natural fireflies illuminate the night sky along clean mountain streams.",
    image: mujuFireflyImg,
    highlight: "Guided night walks into pristine forests filled with twinkling wild fireflies",
    features: ["Night firefly safari", "Stargazing observatory", "Traditional log bridge fire festival"],
    month: 8
  },
  {
    id: "bonghwa-euno",
    name: "Bonghwa Eun-eo (Ayu) Festival",
    koreanName: "봉화 은어축제",
    season: "Summer",
    region: "Gyeongsang",
    category: "Food & Gourmet",
    location: "Naeseongcheon Stream, Bonghwa-gun, Gyeongsangbuk-do",
    dateRange: "Late July – Early August",
    description: "A refreshing summer river festival where visitors splash in clear stream waters to catch sweetfish (Eun-eo) with scoop nets or bare hands, then charcoal-grill their fresh catch.",
    image: bonghwaSweetfishImg,
    highlight: "Catching sweetfish bare-handed in mountain streams and grilling them on site",
    features: ["Bare-handed fish catching", "Charcoal grilling zone", "Water pistol fights"],
    month: 7
  },
  {
    id: "andong",
    name: "Andong Mask Dance Festival",
    koreanName: "안동국제탈춤페스티벌",
    season: "Autumn",
    region: "Gyeongsang",
    category: "Traditional & Culture",
    location: "Hahoe Folk Village, Andong, Gyeongsangbuk-do",
    dateRange: "Late September – Early October",
    description: "A cultural festival celebrating Korea's traditional masked performance arts (Talchum). Set in a UNESCO folk village, the performances incorporate satirical storylines mocking historic elites.",
    image: andongImg,
    highlight: "Traditional Hahoe Pyolshin Gut Talchum comedy ritual",
    features: ["Mask making workshops", "World mask collection", "Traditional fire-bridge lighting"],
    month: 10
  },
  {
    id: "jinju-yudeung",
    name: "Jinju Namgang Yudeung Festival",
    koreanName: "진주남강유등축제",
    season: "Autumn",
    region: "Gyeongsang",
    category: "Night & Lights",
    location: "Nam River & Jinjuseong Fortress, Jinju-si",
    dateRange: "October",
    description: "One of Korea's most stunning floating lantern festivals. Thousands of beautifully illuminated lanterns float on the Nam River, commemorating the historical defense during the Imjin War (1592).",
    image: jinjuYudeungImg,
    highlight: "Walking across the lantern-lit pontoon bridges of the Nam River",
    features: ["Custom wishing lantern floating", "World traditional lantern exhibition", "River light shows"],
    month: 10
  },
  {
    id: "gimje-horizon",
    name: "Gimje Horizon Festival",
    koreanName: "김제지평선축제",
    season: "Autumn",
    region: "Jeolla",
    category: "Traditional & Culture",
    location: "Byeokgolje, Gimje-si, Jeollabuk-do",
    dateRange: "Late September – Early October",
    description: "Celebrating Korea's agricultural golden fields, this festival is held at Byeokgolje, the oldest reservoir in Korea. Gimje is the only region in Korea with a clear flat horizon.",
    image: gimjeHorizonImg,
    highlight: "The majestic golden field twin straw dragon performance",
    features: ["Traditional rice harvesting", "Giant kite-flying competition", "Country food tasting"],
    month: 10
  },
  {
    id: "seoul-fireworks",
    name: "Seoul International Fireworks Festival",
    koreanName: "서울세계불꽃축제",
    season: "Autumn",
    region: "Seoul/Capital",
    category: "Night & Lights",
    location: "Yeouido Hangang Park, Seoul",
    dateRange: "Early October",
    description: "One of Asia's largest pyrotechnic spectacles, where world-class fireworks teams illuminate the night sky over the Han River and 63 Building with synchronized music.",
    image: "https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?q=80&w=1200&auto=format&fit=crop",
    highlight: "Dazzling fireworks set to classical and K-Pop music reflected on the Han River",
    features: ["World pyrotechnic teams", "Daytime laser show", "Han River picnic party"],
    month: 10
  },
  {
    id: "busan-fireworks",
    name: "Busan International Fireworks Festival",
    koreanName: "부산불꽃축제",
    season: "Autumn",
    region: "Gyeongsang",
    category: "Night & Lights",
    location: "Gwangalli Beach, Busan",
    dateRange: "Early November",
    description: "A breathtaking fireworks festival framed by the iconic Gwangan Bridge. Millions gather on the sandy beach to watch giant Niagara fall fireworks and laser light shows.",
    image: busanGwanganImg,
    highlight: "The 1km Niagara fireworks cascade dropping from Gwangan Bridge into the sea",
    features: ["Gwangan Bridge light show", "Beachfront music concert", "Ocean boat viewing"],
    month: 11
  },
  {
    id: "anseong-baudogi",
    name: "Anseong Baudogi Folk Festival",
    koreanName: "안성맞춤 남사당 바우덕이축제",
    season: "Autumn",
    region: "Seoul/Capital",
    category: "Traditional & Culture",
    location: "Anseong Matchum Land, Anseong-si, Gyeonggi-do",
    dateRange: "Early October",
    description: "Honoring Baudogi, the legendary female leader of Namsadang (traveling troupe of folk performers). Features tightrope walking, plate spinning, and traditional mask dancing.",
    image: hanbokCourtImg,
    highlight: "High-wire tightrope acrobatics performed over cheering crowds",
    features: ["Namsadang tightrope show", "Pungmul drum parade", "Joseon market street"],
    month: 10
  },
  {
    id: "cheongsong-apple",
    name: "Cheongsong Apple Festival",
    koreanName: "청송사과축제",
    season: "Autumn",
    region: "Gyeongsang",
    category: "Food & Gourmet",
    location: "Yongjeoncheon Stream Park, Cheongsong-gun, Gyeongsangbuk-do",
    dateRange: "Late October – Early November",
    description: "Held in the clean mountain valleys of Cheongsong, famed for sweet crisp apples. Visitors sample sweet honey apples, bake apple pies, and take home fresh local produce.",
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&w=1200&auto=format&fit=crop",
    highlight: "Apple harvesting games and tasting sweet honey-core Cheongsong apples",
    features: ["Apple pie making", "Local farm produce market", "Night apple lantern walk"],
    month: 11
  },
  {
    id: "suncheon-reeds",
    name: "Suncheon Bay Reeds Festival",
    koreanName: "순천만 갈대축제",
    season: "Autumn",
    region: "Jeolla",
    category: "Flower & Nature",
    location: "Suncheon Bay Wetland Reserve, Jeollanam-do",
    dateRange: "Late October",
    description: "A serene eco-festival amidst 5.4 square kilometers of golden waving reeds in Korea's premier coastal wetland reserve, frequented by migratory hooded cranes.",
    image: suncheonReedsImg,
    highlight: "Golden reed boardwalk strolls during crimson coastal sunsets",
    features: ["Wetland boat tour", "Migratory bird watching", "Eco music concert"],
    month: 10
  },
  {
    id: "seoul-lantern",
    name: "Seoul Lantern Festival",
    koreanName: "서울빛초롱축제",
    season: "Winter",
    region: "Seoul/Capital",
    category: "Night & Lights",
    location: "Gwanghwamun Square & Cheonggyecheon, Seoul",
    dateRange: "Late December – Mid-January",
    description: "Downtown Seoul turns into a fairy tale with hundreds of massive Hanji paper lanterns illuminating Cheonggyecheon Stream and Gwanghwamun Square.",
    image: seoulLanternImg,
    highlight: "Cheonggyecheon illuminated pathway strolls in crisp winter air",
    features: ["Wish lantern launching", "Paper-craft workshops", "Seasonal food stalls"],
    month: 12
  },
  {
    id: "hwacheon-ice",
    name: "Hwacheon Sancheoneo Ice Festival",
    koreanName: "화천산천어축제",
    season: "Winter",
    region: "Gangwon",
    category: "Winter & Ice",
    location: "Hwacheon-stream, Hwacheon-gun, Gangwon-do",
    dateRange: "January",
    description: "Recognized as one of the world's winter wonders, millions gather to catch mountain trout (Sancheoneo) through holes drilled into a 40cm-thick frozen river.",
    image: hwacheonIceImg,
    highlight: "Catching fresh mountain trout on a frozen river and grilling it on-site",
    features: ["Bare-handed trout fishing", "Giant ice sleds and slides", "Indoor ice sculpture plaza"],
    month: 1
  },
  {
    id: "pyeongchang-trout",
    name: "Pyeongchang Trout Festival",
    koreanName: "평창송어축제",
    season: "Winter",
    region: "Gangwon",
    category: "Winter & Ice",
    location: "Odaecheon Stream, Pyeongchang-gun, Gangwon-do",
    dateRange: "Late December – Late January",
    description: "Held in Odaesan Mountain's cold snowlands (host of 2018 Winter Olympics). Visitors enjoy ice fishing for trout, snow rafting, ATV sledding, and outdoor trout barbecues.",
    image: pyeongchangTroutImg,
    highlight: "Ice trout fishing and snow rafting against Gangwon's white mountain scenery",
    features: ["Ice trout fishing", "Snow raft rides", "Fresh trout sashimi & grill"],
    month: 1
  },
  {
    id: "cheongyang-ice",
    name: "Cheongyang Alps Village Ice Fountain Festival",
    koreanName: "청양 알프스마을 얼음분수축제",
    season: "Winter",
    region: "Chungcheong",
    category: "Winter & Ice",
    location: "Alps Village, Cheongyang-gun, Chungcheongnam-do",
    dateRange: "January – February",
    description: "A charming rural winter village featuring massive frozen ice towers, ice castles, tube bobsledding, roasted sweet potatoes, and traditional winter games.",
    image: cheongyangIceFountainImg,
    highlight: "Giant frozen ice fountain towers and ice castle photo zones",
    features: ["Ice slide bobsledding", "Roasting sweet potatoes over bonfire", "Snow sculpture park"],
    month: 1
  },
  {
    id: "taebaek-snow",
    name: "Taebaeksan Snow Festival",
    koreanName: "태백산 눈축제",
    season: "Winter",
    region: "Gangwon",
    category: "Winter & Ice",
    location: "Taebaeksan National Park, Gangwon-do",
    dateRange: "Late January",
    description: "High in the snow-capped Taebaek mountains, giant masterwork snow sculptures depict mythical palaces and characters alongside winter hiking trails.",
    image: "https://images.unsplash.com/photo-1483664852095-d6cc6870702d?q=80&w=1200&auto=format&fit=crop",
    highlight: "Massive scale snow sculpture park set in snowy mountain peaks",
    features: ["Monumental snow sculptures", "Igloo cafe lounge", "Taebaeksan snow trek"],
    month: 1
  }
];

export const HANGUL_CONCEPTS: HangulConcept[] = [
  {
    hangul: "정",
    romanization: "Jeong",
    meaning: "Deep Connection & Affection",
    poeticDescription: "A uniquely Korean emotional concept transcending simple love. It refers to the deep, silent bonds of affection, loyalty, and mutual understanding built slowly over shared time and vulnerability."
  },
  {
    hangul: "흥",
    romanization: "Heung",
    meaning: "Spontaneous Joy & Ecstasy",
    poeticDescription: "An inner sense of rhythmic excitement, collective high spirits, and deep artistic energy. It represents the Korean spirit of erupting into song, dance, and creative celebrations of life."
  },
  {
    hangul: "멋",
    romanization: "Meot",
    meaning: "Effortless Cool & Chic Style",
    poeticDescription: "Refined aesthetic grace and inner coolness. True 'meot' is not about expensive luxury, but an innate, casual elegance in how one carries oneself, styles apparel, or designs art."
  },
  {
    hangul: "한",
    romanization: "Han",
    meaning: "Sorrow Transformed to Hope",
    poeticDescription: "A collective cultural emotion of bittersweet sorrow, longing, and historical resilience. 'Han' represents the strength to bear injustice and sorrow, channeling it into art, music, and progress."
  },
  {
    hangul: "누리",
    romanization: "Nuri",
    meaning: "The Wide World",
    poeticDescription: "A pure traditional Korean word for the expansive, beautiful world. It represents a vision of global community, welcoming diverse cultures, and connecting hearts across the peninsula and beyond."
  }
];

export const CARD_STYLES: CardStyle[] = [
  {
    id: "minimal-moon",
    name: "Moon Jar Minimal",
    bgGradient: "from-amber-50 to-stone-100",
    textColor: "text-stone-800",
    accentColor: "border-stone-400 bg-stone-900 text-stone-100",
    fontStyle: "font-display font-medium"
  },
  {
    id: "imperial-red",
    name: "Royal Joseon Red",
    bgGradient: "from-red-900 to-red-950",
    textColor: "text-red-50",
    accentColor: "border-amber-400 bg-amber-500 text-amber-950",
    fontStyle: "font-display font-bold"
  },
  {
    id: "ink-mountain",
    name: "Ink Wash (Sumukhwa)",
    bgGradient: "from-slate-900 via-stone-900 to-black",
    textColor: "text-slate-50",
    accentColor: "border-slate-500 bg-white text-slate-900",
    fontStyle: "font-mono font-medium"
  },
  {
    id: "dancheong-teal",
    name: "Palace Dancheong",
    bgGradient: "from-teal-950 via-emerald-900 to-slate-950",
    textColor: "text-emerald-50",
    accentColor: "border-orange-400 bg-orange-500 text-orange-950",
    fontStyle: "font-sans font-semibold"
  }
];
